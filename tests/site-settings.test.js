import { describe, it, expect, beforeEach } from "vitest";
import {
  getGlobalSettings,
  setGlobalSettings,
  getSiteSettings,
  setSiteSettings,
  removeSiteSettings,
  resolveSettings,
  normalizeSiteSettings,
} from "../src/shared/site-settings.js";
import { DEFAULTS } from "../src/shared/defaults.js";

describe("site-settings", () => {
  beforeEach(() => {
    chrome.storage.sync._reset();
    chrome.runtime.lastError = null;
  });

  describe("getGlobalSettings", () => {
    it("returns defaults when storage is empty", async () => {
      expect(await getGlobalSettings()).toEqual(DEFAULTS);
    });

    it("returns stored global settings", async () => {
      chrome.storage.sync._reset({
        fontFamily: "opendyslexic-alta",
        fontSize: 1.4,
        letterSpacing: 0.1,
        wordSpacing: 0.2,
      });
      const result = await getGlobalSettings();
      expect(result).toEqual({
        fontFamily: "opendyslexic-alta",
        fontSize: 1.4,
        letterSpacing: 0.1,
        wordSpacing: 0.2,
      });
    });

    it("migrates legacy boolean settings", async () => {
      chrome.storage.sync._reset({ fontEnabled: false });
      const result = await getGlobalSettings();
      expect(result.fontFamily).toBe("none");
    });
  });

  describe("setGlobalSettings", () => {
    it("writes the flat global keys", async () => {
      await setGlobalSettings({
        fontFamily: "opendyslexic-mono",
        fontSize: 1.1,
        letterSpacing: 0.05,
        wordSpacing: 0.1,
      });
      expect(chrome.storage.sync._store).toMatchObject({
        fontFamily: "opendyslexic-mono",
        fontSize: 1.1,
        letterSpacing: 0.05,
        wordSpacing: 0.1,
      });
    });
  });

  describe("getSiteSettings", () => {
    it("returns null when no override exists", async () => {
      expect(await getSiteSettings("example.com")).toBeNull();
    });

    it("returns the stored override for a domain", async () => {
      const settings = {
        fontFamily: "opendyslexic",
        fontSize: 1.3,
        letterSpacing: 0.15,
        wordSpacing: 0.25,
      };
      chrome.storage.sync._reset({ "site:example.com": settings });
      expect(await getSiteSettings("example.com")).toEqual(settings);
    });

    it("does not confuse different domains", async () => {
      chrome.storage.sync._reset({
        "site:example.com": { fontFamily: "opendyslexic" },
      });
      expect(await getSiteSettings("other.com")).toBeNull();
    });
  });

  describe("setSiteSettings", () => {
    it("stores an override under the site: prefixed key", async () => {
      await setSiteSettings("example.com", {
        fontFamily: "opendyslexic",
        fontSize: 1.5,
        letterSpacing: 0.2,
        wordSpacing: 0.3,
      });
      expect(chrome.storage.sync._store["site:example.com"]).toEqual({
        fontFamily: "opendyslexic",
        fontSize: 1.5,
        letterSpacing: 0.2,
        wordSpacing: 0.3,
      });
    });

    it("keeps separate domains independent", async () => {
      await setSiteSettings("a.com", { fontFamily: "opendyslexic" });
      await setSiteSettings("b.com", { fontFamily: "none" });
      expect(chrome.storage.sync._store["site:a.com"].fontFamily).toBe(
        "opendyslexic",
      );
      expect(chrome.storage.sync._store["site:b.com"].fontFamily).toBe("none");
    });
  });

  describe("removeSiteSettings", () => {
    it("removes the override for a domain", async () => {
      await setSiteSettings("example.com", { fontFamily: "opendyslexic" });
      await removeSiteSettings("example.com");
      expect(chrome.storage.sync._store["site:example.com"]).toBeUndefined();
    });

    it("does not affect other domains", async () => {
      await setSiteSettings("a.com", { fontFamily: "opendyslexic" });
      await setSiteSettings("b.com", { fontFamily: "none" });
      await removeSiteSettings("a.com");
      expect(chrome.storage.sync._store["site:a.com"]).toBeUndefined();
      expect(chrome.storage.sync._store["site:b.com"]).toBeDefined();
    });
  });

  describe("resolveSettings", () => {
    it("returns global settings when no site override exists", async () => {
      chrome.storage.sync._reset({ fontFamily: "opendyslexic-alta" });
      const result = await resolveSettings("example.com");
      expect(result.fontFamily).toBe("opendyslexic-alta");
    });

    it("returns the site override when one exists", async () => {
      chrome.storage.sync._reset({
        fontFamily: "opendyslexic",
        "site:example.com": {
          fontFamily: "opendyslexic-mono",
          fontSize: 1.6,
          letterSpacing: 0,
          wordSpacing: 0,
        },
      });
      const result = await resolveSettings("example.com");
      expect(result.fontFamily).toBe("opendyslexic-mono");
      expect(result.fontSize).toBe(1.6);
    });

    it("falls back to global settings for a falsy domain", async () => {
      chrome.storage.sync._reset({ fontFamily: "opendyslexic-alta" });
      const result = await resolveSettings(null);
      expect(result.fontFamily).toBe("opendyslexic-alta");
    });

    it("fills keys missing from an older site override from global", async () => {
      chrome.storage.sync._reset({
        fontSize: 1.4,
        "site:example.com": {
          fontFamily: "opendyslexic-mono",
          letterSpacing: 0,
          wordSpacing: 0,
        },
      });
      const result = await resolveSettings("example.com");
      expect(result.fontFamily).toBe("opendyslexic-mono");
      expect(result.fontSize).toBe(1.4);
    });
  });

  describe("normalizeSiteSettings", () => {
    const global = {
      fontFamily: "opendyslexic",
      fontSize: 1.2,
      letterSpacing: 0.1,
      wordSpacing: 0.2,
    };

    it("returns null when there is no override", () => {
      expect(normalizeSiteSettings(null, global)).toBeNull();
    });

    it("keeps the override's own values", () => {
      const site = {
        fontFamily: "none",
        fontSize: 1.8,
        letterSpacing: 0,
        wordSpacing: 0,
      };
      expect(normalizeSiteSettings(site, global)).toEqual(site);
    });

    it("fills missing keys from global", () => {
      const result = normalizeSiteSettings({ fontFamily: "none" }, global);
      expect(result).toEqual({ ...global, fontFamily: "none" });
    });

    it("drops unknown keys", () => {
      const result = normalizeSiteSettings({ stray: true }, global);
      expect(result).not.toHaveProperty("stray");
    });
  });

  describe("setters only persist known keys", () => {
    it("setGlobalSettings ignores unknown fields", async () => {
      await setGlobalSettings({ ...DEFAULTS, stray: true });
      expect(chrome.storage.sync._store).not.toHaveProperty("stray");
    });

    it("setSiteSettings ignores unknown fields", async () => {
      await setSiteSettings("example.com", { ...DEFAULTS, stray: true });
      expect(chrome.storage.sync._store["site:example.com"]).not.toHaveProperty(
        "stray",
      );
    });
  });
});

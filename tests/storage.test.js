import { describe, it, expect, beforeEach } from "vitest";
import { getSync, setSync, getLocal, setLocal, removeLocal } from "../src/shared/storage.js";

describe("storage helpers", () => {
  beforeEach(() => {
    chrome.storage.sync._reset();
    chrome.storage.local._reset();
    chrome.runtime.lastError = null;
  });

  describe("getSync", () => {
    it("resolves with stored values", async () => {
      chrome.storage.sync._reset({ fontEnabled: true });
      const result = await getSync(["fontEnabled"]);
      expect(result).toEqual({ fontEnabled: true });
    });

    it("resolves with empty object for missing keys", async () => {
      const result = await getSync(["nonexistent"]);
      expect(result).toEqual({});
    });
  });

  describe("setSync", () => {
    it("stores values", async () => {
      await setSync({ spacingEnabled: true });
      expect(chrome.storage.sync._store.spacingEnabled).toBe(true);
    });
  });

  describe("getLocal", () => {
    it("resolves with stored values", async () => {
      chrome.storage.local._reset({ ocrImage: "data:image/png;base64,abc" });
      const result = await getLocal(["ocrImage"]);
      expect(result).toEqual({ ocrImage: "data:image/png;base64,abc" });
    });
  });

  describe("setLocal", () => {
    it("stores values", async () => {
      await setLocal({ ocrImage: "data:image/png;base64,xyz" });
      expect(chrome.storage.local._store.ocrImage).toBe(
        "data:image/png;base64,xyz",
      );
    });
  });

  describe("removeLocal", () => {
    it("removes stored values", async () => {
      chrome.storage.local._reset({ ocrImage: "data:..." });
      await removeLocal("ocrImage");
      expect(chrome.storage.local._store.ocrImage).toBeUndefined();
    });
  });
});

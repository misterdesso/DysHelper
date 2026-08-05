import { describe, it, expect, beforeEach } from "vitest";
import { applySettings } from "../src/content/toggles.js";

describe("applySettings", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("style");
  });

  describe("font family", () => {
    it("enables font class and sets custom property for opendyslexic", () => {
      applySettings({ fontFamily: "opendyslexic", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-font-enabled")).toBe(true);
      expect(document.documentElement.style.getPropertyValue("--dys-font-family")).toBe('"OpenDyslexic"');
    });

    it("enables font class and sets custom property for opendyslexic-alta", () => {
      applySettings({ fontFamily: "opendyslexic-alta", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-font-enabled")).toBe(true);
      expect(document.documentElement.style.getPropertyValue("--dys-font-family")).toBe('"OpenDyslexicAlta"');
    });

    it("enables font class and sets custom property for opendyslexic-mono", () => {
      applySettings({ fontFamily: "opendyslexic-mono", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-font-enabled")).toBe(true);
      expect(document.documentElement.style.getPropertyValue("--dys-font-family")).toBe('"OpenDyslexicMono"');
    });

    it("removes font class and property when fontFamily is none", () => {
      applySettings({ fontFamily: "opendyslexic", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0 });
      applySettings({ fontFamily: "none", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-font-enabled")).toBe(false);
      expect(document.documentElement.style.getPropertyValue("--dys-font-family")).toBe("");
    });
  });

  describe("font size", () => {
    it("enables font size class and sets custom property when not 1.0", () => {
      applySettings({ fontFamily: "none", fontSize: 1.5, letterSpacing: 0, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-font-size-enabled")).toBe(true);
      expect(document.documentElement.style.getPropertyValue("--dys-font-size")).toBe("1.5");
    });

    it("removes font size class and property when 1.0", () => {
      applySettings({ fontFamily: "none", fontSize: 1.5, letterSpacing: 0, wordSpacing: 0 });
      applySettings({ fontFamily: "none", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-font-size-enabled")).toBe(false);
      expect(document.documentElement.style.getPropertyValue("--dys-font-size")).toBe("");
    });
  });

  describe("spacing", () => {
    it("enables spacing class and sets custom properties when values > 0", () => {
      applySettings({ fontFamily: "none", fontSize: 1.0, letterSpacing: 0.2, wordSpacing: 0.3 });
      expect(document.documentElement.classList.contains("dys-spacing-enabled")).toBe(true);
      expect(document.documentElement.style.getPropertyValue("--dys-letter-spacing")).toBe("0.2em");
      expect(document.documentElement.style.getPropertyValue("--dys-word-spacing")).toBe("0.3em");
    });

    it("removes spacing class and properties when both are 0", () => {
      applySettings({ fontFamily: "none", fontSize: 1.0, letterSpacing: 0.2, wordSpacing: 0.3 });
      applySettings({ fontFamily: "none", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-spacing-enabled")).toBe(false);
      expect(document.documentElement.style.getPropertyValue("--dys-letter-spacing")).toBe("");
      expect(document.documentElement.style.getPropertyValue("--dys-word-spacing")).toBe("");
    });
  });
});

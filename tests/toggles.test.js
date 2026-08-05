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

    it("enables spacing when only letterSpacing > 0", () => {
      applySettings({ fontFamily: "none", fontSize: 1.0, letterSpacing: 0.1, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-spacing-enabled")).toBe(true);
      expect(document.documentElement.style.getPropertyValue("--dys-letter-spacing")).toBe("0.1em");
      expect(document.documentElement.style.getPropertyValue("--dys-word-spacing")).toBe("0em");
    });

    it("enables spacing when only wordSpacing > 0", () => {
      applySettings({ fontFamily: "none", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0.2 });
      expect(document.documentElement.classList.contains("dys-spacing-enabled")).toBe(true);
    });
  });

  describe("combined settings", () => {
    it("applies all features simultaneously", () => {
      applySettings({ fontFamily: "opendyslexic-alta", fontSize: 1.3, letterSpacing: 0.15, wordSpacing: 0.25 });
      const root = document.documentElement;
      expect(root.classList.contains("dys-font-enabled")).toBe(true);
      expect(root.classList.contains("dys-font-size-enabled")).toBe(true);
      expect(root.classList.contains("dys-spacing-enabled")).toBe(true);
      expect(root.style.getPropertyValue("--dys-font-family")).toBe('"OpenDyslexicAlta"');
      expect(root.style.getPropertyValue("--dys-font-size")).toBe("1.3");
      expect(root.style.getPropertyValue("--dys-letter-spacing")).toBe("0.15em");
      expect(root.style.getPropertyValue("--dys-word-spacing")).toBe("0.25em");
    });

    it("disables all features when set to defaults", () => {
      applySettings({ fontFamily: "opendyslexic", fontSize: 1.5, letterSpacing: 0.2, wordSpacing: 0.3 });
      applySettings({ fontFamily: "none", fontSize: 1.0, letterSpacing: 0, wordSpacing: 0 });
      const root = document.documentElement;
      expect(root.classList.contains("dys-font-enabled")).toBe(false);
      expect(root.classList.contains("dys-font-size-enabled")).toBe(false);
      expect(root.classList.contains("dys-spacing-enabled")).toBe(false);
    });

    it("handles font size at minimum boundary (0.8)", () => {
      applySettings({ fontFamily: "none", fontSize: 0.8, letterSpacing: 0, wordSpacing: 0 });
      expect(document.documentElement.classList.contains("dys-font-size-enabled")).toBe(true);
      expect(document.documentElement.style.getPropertyValue("--dys-font-size")).toBe("0.8");
    });
  });
});

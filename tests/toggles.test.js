import { describe, it, expect, beforeEach } from "vitest";
import {
  enableFont,
  disableFont,
  enableSpacing,
  disableSpacing,
} from "../src/content/toggles.js";

describe("content toggles", () => {
  beforeEach(() => {
    document.documentElement.className = "";
  });

  describe("enableFont", () => {
    it("adds opendyslexic-enabled class to html", () => {
      enableFont();
      expect(document.documentElement.classList.contains("opendyslexic-enabled")).toBe(true);
    });
  });

  describe("disableFont", () => {
    it("removes opendyslexic-enabled class from html", () => {
      document.documentElement.classList.add("opendyslexic-enabled");
      disableFont();
      expect(document.documentElement.classList.contains("opendyslexic-enabled")).toBe(false);
    });
  });

  describe("enableSpacing", () => {
    it("adds letter-spacing-enabled class to html", () => {
      enableSpacing();
      expect(document.documentElement.classList.contains("letter-spacing-enabled")).toBe(true);
    });
  });

  describe("disableSpacing", () => {
    it("removes letter-spacing-enabled class from html", () => {
      document.documentElement.classList.add("letter-spacing-enabled");
      disableSpacing();
      expect(document.documentElement.classList.contains("letter-spacing-enabled")).toBe(false);
    });
  });
});

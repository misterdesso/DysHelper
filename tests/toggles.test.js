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
    it("adds dys-font-enabled class to html", () => {
      enableFont();
      expect(
        document.documentElement.classList.contains("dys-font-enabled"),
      ).toBe(true);
    });
  });

  describe("disableFont", () => {
    it("removes dys-font-enabled class from html", () => {
      document.documentElement.classList.add("dys-font-enabled");
      disableFont();
      expect(
        document.documentElement.classList.contains("dys-font-enabled"),
      ).toBe(false);
    });
  });

  describe("enableSpacing", () => {
    it("adds dys-spacing-enabled class to html", () => {
      enableSpacing();
      expect(
        document.documentElement.classList.contains("dys-spacing-enabled"),
      ).toBe(true);
    });
  });

  describe("disableSpacing", () => {
    it("removes dys-spacing-enabled class from html", () => {
      document.documentElement.classList.add("dys-spacing-enabled");
      disableSpacing();
      expect(
        document.documentElement.classList.contains("dys-spacing-enabled"),
      ).toBe(false);
    });
  });
});

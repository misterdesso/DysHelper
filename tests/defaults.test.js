import { describe, it, expect } from "vitest";
import { DEFAULTS, migrateSettings } from "../src/shared/defaults.js";

describe("DEFAULTS", () => {
  it("has expected default values", () => {
    expect(DEFAULTS).toEqual({
      fontFamily: "opendyslexic",
      fontSize: 1.0,
      letterSpacing: 0,
      wordSpacing: 0,
    });
  });
});

describe("migrateSettings", () => {
  it("returns defaults for empty storage", () => {
    expect(migrateSettings({})).toEqual(DEFAULTS);
  });

  it("migrates fontEnabled: true to opendyslexic", () => {
    const result = migrateSettings({ fontEnabled: true });
    expect(result.fontFamily).toBe("opendyslexic");
  });

  it("migrates fontEnabled: false to none", () => {
    const result = migrateSettings({ fontEnabled: false });
    expect(result.fontFamily).toBe("none");
  });

  it("migrates spacingEnabled: true to default spacing values", () => {
    const result = migrateSettings({ spacingEnabled: true });
    expect(result.letterSpacing).toBe(0.15);
    expect(result.wordSpacing).toBe(0.25);
  });

  it("migrates spacingEnabled: false to zero spacing", () => {
    const result = migrateSettings({ spacingEnabled: false });
    expect(result.letterSpacing).toBe(0);
    expect(result.wordSpacing).toBe(0);
  });

  it("migrates combined legacy booleans", () => {
    const result = migrateSettings({
      fontEnabled: true,
      spacingEnabled: true,
    });
    expect(result.fontFamily).toBe("opendyslexic");
    expect(result.letterSpacing).toBe(0.15);
    expect(result.wordSpacing).toBe(0.25);
    expect(result.fontSize).toBe(1.0);
  });

  it("passes through new-schema values unchanged", () => {
    const input = {
      fontFamily: "opendyslexic-alta",
      fontSize: 1.5,
      letterSpacing: 0.2,
      wordSpacing: 0.3,
    };
    expect(migrateSettings(input)).toEqual(input);
  });

  it("prefers fontFamily over fontEnabled when both present", () => {
    const result = migrateSettings({
      fontEnabled: false,
      fontFamily: "opendyslexic-mono",
    });
    expect(result.fontFamily).toBe("opendyslexic-mono");
  });

  it("prefers letterSpacing over spacingEnabled when both present", () => {
    const result = migrateSettings({
      spacingEnabled: true,
      letterSpacing: 0.1,
      wordSpacing: 0.4,
    });
    expect(result.letterSpacing).toBe(0.1);
    expect(result.wordSpacing).toBe(0.4);
  });
});

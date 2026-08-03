import { describe, it, expect } from "vitest";
import { injectFontFaces } from "../src/content/font-loader.js";

describe("injectFontFaces", () => {
  it("appends a style element with id dyshelper-fonts", () => {
    injectFontFaces();

    const injected = document.getElementById("dyshelper-fonts");
    expect(injected).not.toBeNull();
    expect(injected.tagName).toBe("STYLE");
  });

  it("registers OpenDyslexic Regular and Bold", () => {
    const injected = document.getElementById("dyshelper-fonts");
    expect(injected.textContent).toContain("font-family: 'OpenDyslexic'");
    expect(injected.textContent).toContain("OpenDyslexic-Regular.woff2");
    expect(injected.textContent).toContain("OpenDyslexic-Bold.woff2");
  });

  it("registers OpenDyslexicAlta Regular and Bold", () => {
    const injected = document.getElementById("dyshelper-fonts");
    expect(injected.textContent).toContain("font-family: 'OpenDyslexicAlta'");
    expect(injected.textContent).toContain("OpenDyslexicAlta-Regular.woff2");
    expect(injected.textContent).toContain("OpenDyslexicAlta-Bold.woff2");
  });

  it("registers OpenDyslexicMono Regular", () => {
    const injected = document.getElementById("dyshelper-fonts");
    expect(injected.textContent).toContain("font-family: 'OpenDyslexicMono'");
    expect(injected.textContent).toContain("OpenDyslexicMono-Regular.woff2");
  });
});

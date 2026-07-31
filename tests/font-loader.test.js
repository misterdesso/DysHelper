import { describe, it, expect } from "vitest";
import { injectFontFaces } from "../src/content/font-loader.js";

describe("injectFontFaces", () => {
  it("appends a style element with @font-face declarations to head", () => {
    injectFontFaces();

    const styles = document.head.querySelectorAll("style");
    const injected = styles[styles.length - 1];

    expect(injected).toBeDefined();
    expect(injected.textContent).toContain("@font-face");
    expect(injected.textContent).toContain("OpenDyslexic");
    expect(injected.textContent).toContain(
      "chrome-extension://test-extension-id/fonts/OpenDyslexic-Regular.woff2",
    );
    expect(injected.textContent).toContain(
      "chrome-extension://test-extension-id/fonts/OpenDyslexic-Bold.woff2",
    );
  });
});

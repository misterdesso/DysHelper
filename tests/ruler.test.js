import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { updateRuler } from "../src/content/ruler.js";

const ON = { rulerEnabled: true, fontSize: 1.0 };
const OFF = { rulerEnabled: false, fontSize: 1.0 };

let frames = [];

function flushFrames() {
  const pending = frames;
  frames = [];
  pending.forEach((cb) => cb(0));
}

function getHost() {
  return document.querySelector("dyshelper-ruler");
}

function getBand() {
  return getHost().shadowRoot.querySelector(".band");
}

function moveMouse(clientY) {
  document.dispatchEvent(new MouseEvent("mousemove", { clientY }));
}

describe("updateRuler", () => {
  beforeEach(() => {
    frames = [];
    vi.stubGlobal("requestAnimationFrame", (cb) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => {});
  });

  afterEach(() => {
    updateRuler(OFF);
    vi.unstubAllGlobals();
  });

  it("does nothing when disabled", () => {
    updateRuler(OFF);
    expect(getHost()).toBeNull();
  });

  it("mounts a single hidden host when enabled", () => {
    updateRuler(ON);
    updateRuler(ON);
    expect(document.querySelectorAll("dyshelper-ruler")).toHaveLength(1);
    expect(getHost().getAttribute("aria-hidden")).toBe("true");
    expect(getBand().classList.contains("is-visible")).toBe(false);
  });

  it("removes the host when disabled again", () => {
    updateRuler(ON);
    updateRuler(OFF);
    expect(getHost()).toBeNull();
  });

  it("centres the band on the cursor after a mouse move", () => {
    updateRuler(ON);
    moveMouse(200);
    flushFrames();
    expect(getBand().style.transform).toBe("translateY(184px)");
    expect(getBand().classList.contains("is-visible")).toBe(true);
  });

  it("batches rapid moves into one frame using the latest position", () => {
    updateRuler(ON);
    moveMouse(100);
    moveMouse(300);
    expect(frames).toHaveLength(1);
    flushFrames();
    expect(getBand().style.transform).toBe("translateY(284px)");
  });

  it("hides the band when the cursor leaves the window", () => {
    updateRuler(ON);
    moveMouse(200);
    flushFrames();
    document.dispatchEvent(new MouseEvent("mouseout", { relatedTarget: null }));
    expect(getBand().classList.contains("is-visible")).toBe(false);
  });

  it("stops tracking the mouse once disabled", () => {
    updateRuler(ON);
    updateRuler(OFF);
    moveMouse(200);
    expect(frames).toHaveLength(0);
  });

  it("counter-zooms and scales its height with the font size", () => {
    updateRuler({ rulerEnabled: true, fontSize: 2.0 });
    const host = getHost();
    expect(host.style.getPropertyValue("--dys-ruler-zoom")).toBe("0.5");
    expect(host.style.getPropertyValue("--dys-ruler-height")).toBe("64px");

    moveMouse(200);
    flushFrames();
    expect(getBand().style.transform).toBe("translateY(168px)");
  });

  it("re-attaches if the page removed the host", () => {
    updateRuler(ON);
    getHost().remove();
    updateRuler(ON);
    expect(document.querySelectorAll("dyshelper-ruler")).toHaveLength(1);
  });
});

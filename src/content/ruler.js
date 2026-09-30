const HOST_TAG = "dyshelper-ruler";

// Visual defaults. Future settings (height, tint) can override these in
// updateRuler() without touching the rendering code.
const RULER_STYLE = {
  baseHeight: 32, // px at 1.0x font size; scales with the font size setting
  tint: "rgba(255, 221, 87, 0.3)",
};

// Host styles live in the shadow root's :host rule; !important there beats
// any normal page styles that might match the host element.
const SHADOW_CSS = `
:host {
  all: initial !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 0 !important;
  height: 0 !important;
  pointer-events: none !important;
  z-index: 2147483647 !important;
  zoom: var(--dys-ruler-zoom, 1) !important;
}
.band {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--dys-ruler-height, 32px);
  background: var(--dys-ruler-tint);
  pointer-events: none;
  will-change: transform;
  visibility: hidden;
}
.band.is-visible {
  visibility: visible;
}
@media print {
  .band {
    display: none;
  }
}
`;

let host = null;
let band = null;
let height = RULER_STYLE.baseHeight;
let pendingY = null;
let frame = null;

function render() {
  frame = null;
  if (!band || pendingY === null) return;
  band.style.transform = `translateY(${pendingY - height / 2}px)`;
  band.classList.add("is-visible");
}

function onMouseMove(event) {
  pendingY = event.clientY;
  if (frame === null) frame = requestAnimationFrame(render);
}

// relatedTarget is null when the cursor leaves the window entirely.
function onMouseOut(event) {
  if (!event.relatedTarget && band) band.classList.remove("is-visible");
}

function mount() {
  host = document.createElement(HOST_TAG);
  host.setAttribute("aria-hidden", "true");
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = SHADOW_CSS;
  band = document.createElement("div");
  band.className = "band";
  shadow.append(style, band);
  document.documentElement.appendChild(host);

  window.addEventListener("mousemove", onMouseMove, {
    capture: true,
    passive: true,
  });
  window.addEventListener("mouseout", onMouseOut, { capture: true });
}

function unmount() {
  window.removeEventListener("mousemove", onMouseMove, { capture: true });
  window.removeEventListener("mouseout", onMouseOut, { capture: true });
  if (frame !== null) cancelAnimationFrame(frame);
  host.remove();
  host = null;
  band = null;
  pendingY = null;
  frame = null;
}

export function updateRuler(settings) {
  if (!settings.rulerEnabled) {
    if (host) unmount();
    return;
  }

  if (!host) mount();
  // Some pages rebuild the document; re-attach if we were removed.
  else if (!host.isConnected) document.documentElement.appendChild(host);

  // The font size setting zooms <html>, which would also scale this fixed
  // overlay. Counter-zoom the host so positions stay in viewport pixels, and
  // scale the band height instead so it still matches the text size.
  const fontSize = settings.fontSize || 1;
  height = RULER_STYLE.baseHeight * fontSize;
  host.style.setProperty("--dys-ruler-zoom", String(1 / fontSize));
  host.style.setProperty("--dys-ruler-height", `${height}px`);
  host.style.setProperty("--dys-ruler-tint", RULER_STYLE.tint);

  if (pendingY !== null) render();
}

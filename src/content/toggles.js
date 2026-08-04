const FONT_CLASS = "dys-font-enabled";
const FONT_SIZE_CLASS = "dys-font-size-enabled";
const SPACING_CLASS = "dys-spacing-enabled";

const FONT_FAMILY_MAP = {
  opendyslexic: "OpenDyslexic",
  "opendyslexic-alta": "OpenDyslexicAlta",
  "opendyslexic-mono": "OpenDyslexicMono",
};

export function applySettings(settings) {
  const root = document.documentElement;

  if (settings.fontFamily && settings.fontFamily !== "none") {
    const cssFamily = FONT_FAMILY_MAP[settings.fontFamily];
    root.style.setProperty("--dys-font-family", `"${cssFamily}"`);
    root.classList.add(FONT_CLASS);
  } else {
    root.classList.remove(FONT_CLASS);
    root.style.removeProperty("--dys-font-family");
  }

  if (settings.fontSize && settings.fontSize !== 1.0) {
    root.style.setProperty("--dys-font-size", String(settings.fontSize));
    root.classList.add(FONT_SIZE_CLASS);
  } else {
    root.classList.remove(FONT_SIZE_CLASS);
    root.style.removeProperty("--dys-font-size");
  }

  if (settings.letterSpacing > 0 || settings.wordSpacing > 0) {
    root.style.setProperty(
      "--dys-letter-spacing",
      `${settings.letterSpacing}em`,
    );
    root.style.setProperty("--dys-word-spacing", `${settings.wordSpacing}em`);
    root.classList.add(SPACING_CLASS);
  } else {
    root.classList.remove(SPACING_CLASS);
    root.style.removeProperty("--dys-letter-spacing");
    root.style.removeProperty("--dys-word-spacing");
  }
}

export function enableFont() {
  document.documentElement.classList.add(FONT_CLASS);
}

export function disableFont() {
  document.documentElement.classList.remove(FONT_CLASS);
}

export function enableSpacing() {
  document.documentElement.classList.add(SPACING_CLASS);
}

export function disableSpacing() {
  document.documentElement.classList.remove(SPACING_CLASS);
}

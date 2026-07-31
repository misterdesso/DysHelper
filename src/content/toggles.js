const FONT_CLASS = "opendyslexic-enabled";
const SPACING_CLASS = "letter-spacing-enabled";

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

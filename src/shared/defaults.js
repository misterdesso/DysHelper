export const DEFAULTS = {
  fontFamily: "opendyslexic",
  fontSize: 1.0,
  letterSpacing: 0,
  wordSpacing: 0,
};

export function migrateSettings(raw) {
  const settings = { ...DEFAULTS };

  if ("fontFamily" in raw) {
    settings.fontFamily = raw.fontFamily;
  } else if ("fontEnabled" in raw) {
    settings.fontFamily = raw.fontEnabled !== false ? "opendyslexic" : "none";
  }

  if ("letterSpacing" in raw) {
    settings.letterSpacing = raw.letterSpacing;
    settings.wordSpacing = raw.wordSpacing ?? DEFAULTS.wordSpacing;
  } else if ("spacingEnabled" in raw) {
    if (raw.spacingEnabled) {
      settings.letterSpacing = 0.15;
      settings.wordSpacing = 0.25;
    } else {
      settings.letterSpacing = 0;
      settings.wordSpacing = 0;
    }
  }

  if ("fontSize" in raw) {
    settings.fontSize = raw.fontSize;
  }

  return settings;
}

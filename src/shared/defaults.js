export const DEFAULTS = {
  fontFamily: "opendyslexic",
  fontSize: 1.0,
  letterSpacing: 0,
  wordSpacing: 0,
};

// Single source of truth for which keys make up a settings object.
export const SETTING_KEYS = Object.keys(DEFAULTS);

export function migrateSettings(raw) {
  const settings = { ...DEFAULTS };

  for (const key of SETTING_KEYS) {
    if (raw[key] !== undefined) settings[key] = raw[key];
  }

  // Legacy booleans only apply when the newer keys are absent.
  if (raw.fontFamily === undefined && "fontEnabled" in raw) {
    settings.fontFamily = raw.fontEnabled !== false ? "opendyslexic" : "none";
  }

  if (raw.letterSpacing === undefined && "spacingEnabled" in raw) {
    settings.letterSpacing = raw.spacingEnabled ? 0.15 : 0;
    settings.wordSpacing = raw.spacingEnabled ? 0.25 : 0;
  }

  return settings;
}

import { migrateSettings } from "./defaults.js";
import { getSync, setSync, removeSync } from "./storage.js";

const GLOBAL_KEYS = [
  "fontFamily",
  "fontSize",
  "letterSpacing",
  "wordSpacing",
  // Legacy keys, read for migration only.
  "fontEnabled",
  "spacingEnabled",
];

function siteKey(domain) {
  return `site:${domain}`;
}

export async function getGlobalSettings() {
  const raw = await getSync(GLOBAL_KEYS);
  return migrateSettings(raw);
}

export function setGlobalSettings(settings) {
  return setSync({
    fontFamily: settings.fontFamily,
    fontSize: settings.fontSize,
    letterSpacing: settings.letterSpacing,
    wordSpacing: settings.wordSpacing,
  });
}

export async function getSiteSettings(domain) {
  const key = siteKey(domain);
  const raw = await getSync([key]);
  return raw[key] ?? null;
}

export function setSiteSettings(domain, settings) {
  return setSync({
    [siteKey(domain)]: {
      fontFamily: settings.fontFamily,
      fontSize: settings.fontSize,
      letterSpacing: settings.letterSpacing,
      wordSpacing: settings.wordSpacing,
    },
  });
}

export function removeSiteSettings(domain) {
  return removeSync(siteKey(domain));
}

/**
 * Resolves the effective settings for a domain: the site-specific override
 * if one exists, otherwise the global default.
 */
export async function resolveSettings(domain) {
  const site = domain ? await getSiteSettings(domain) : null;
  if (site) return site;
  return getGlobalSettings();
}

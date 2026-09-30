import { SETTING_KEYS, migrateSettings } from "./defaults.js";
import { getSync, setSync, removeSync } from "./storage.js";

const GLOBAL_KEYS = [
  ...SETTING_KEYS,
  // Legacy keys, read for migration only.
  "fontEnabled",
  "spacingEnabled",
];

function siteKey(domain) {
  return `site:${domain}`;
}

// Copies only the known setting keys, so stray fields are never persisted.
function pickSettings(settings) {
  const picked = {};
  for (const key of SETTING_KEYS) picked[key] = settings[key];
  return picked;
}

/**
 * Site overrides saved before a setting existed lack that key. Fill any
 * missing keys from the global settings so the override stays complete.
 */
export function normalizeSiteSettings(site, global) {
  if (!site) return null;
  const normalized = { ...global };
  for (const key of SETTING_KEYS) {
    if (site[key] !== undefined) normalized[key] = site[key];
  }
  return normalized;
}

export async function getGlobalSettings() {
  const raw = await getSync(GLOBAL_KEYS);
  return migrateSettings(raw);
}

export function setGlobalSettings(settings) {
  return setSync(pickSettings(settings));
}

export async function getSiteSettings(domain) {
  const key = siteKey(domain);
  const raw = await getSync([key]);
  return raw[key] ?? null;
}

export function setSiteSettings(domain, settings) {
  return setSync({ [siteKey(domain)]: pickSettings(settings) });
}

export function removeSiteSettings(domain) {
  return removeSync(siteKey(domain));
}

/**
 * Resolves the effective settings for a domain: the site-specific override
 * if one exists, otherwise the global default.
 */
export async function resolveSettings(domain) {
  const global = await getGlobalSettings();
  const site = domain ? await getSiteSettings(domain) : null;
  return normalizeSiteSettings(site, global) ?? global;
}

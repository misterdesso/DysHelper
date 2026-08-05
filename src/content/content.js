import { getSync } from "../shared/storage.js";
import { migrateSettings } from "../shared/defaults.js";
import { injectFontFaces } from "./font-loader.js";
import { applySettings } from "./toggles.js";

injectFontFaces();

getSync([
  "fontFamily",
  "fontSize",
  "letterSpacing",
  "wordSpacing",
  "fontEnabled",
  "spacingEnabled",
]).then((raw) => {
  const settings = migrateSettings(raw);
  applySettings(settings);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "applySettings" && message.settings) {
    applySettings(message.settings);
  }
  sendResponse({ success: true });
  return true;
});

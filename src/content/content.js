import { getSync } from "../shared/storage.js";
import { migrateSettings } from "../shared/defaults.js";
import { injectFontFaces } from "./font-loader.js";
import {
  applySettings,
  enableFont,
  disableFont,
  enableSpacing,
  disableSpacing,
} from "./toggles.js";

injectFontFaces();

getSync([
  "fontEnabled",
  "spacingEnabled",
  "fontFamily",
  "fontSize",
  "letterSpacing",
  "wordSpacing",
]).then((raw) => {
  const settings = migrateSettings(raw);
  applySettings(settings);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "applySettings" && message.settings) {
    applySettings(message.settings);
  } else {
    const actions = { enableFont, disableFont, enableSpacing, disableSpacing };
    const handler = actions[message.action];
    if (handler) handler();
  }
  sendResponse({ success: true });
  return true;
});

import { getBaseDomain } from "../shared/domain.js";
import { resolveSettings } from "../shared/site-settings.js";
import { injectFontFaces } from "./font-loader.js";
import { applySettings } from "./toggles.js";

injectFontFaces();

const domain = getBaseDomain(location.hostname);

resolveSettings(domain).then((settings) => {
  applySettings(settings);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "applySettings" && message.settings) {
    applySettings(message.settings);
  }
  sendResponse({ success: true });
  return true;
});

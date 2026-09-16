import { getBaseDomain } from "../shared/domain.js";
import { resolveSettings } from "../shared/site-settings.js";
import { injectFontFaces } from "./font-loader.js";
import { applySettings } from "./toggles.js";

injectFontFaces();

const domain = getBaseDomain(location.hostname);

function applySaved() {
  return resolveSettings(domain).then(applySettings);
}

applySaved();

// While the popup is open it connects a port and streams live previews over
// it. When the popup closes the port disconnects, and we re-apply the saved
// settings from storage — reverting any unsaved preview, or keeping the change
// if it was saved (storage reflects it either way).
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "dys-preview") return;

  port.onMessage.addListener((message) => {
    if (message && message.settings) {
      applySettings(message.settings);
    }
  });

  port.onDisconnect.addListener(() => {
    applySaved();
  });
});

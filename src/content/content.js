import { getSync } from "../shared/storage.js";
import { injectFontFaces } from "./font-loader.js";
import { enableFont, disableFont, enableSpacing, disableSpacing } from "./toggles.js";

injectFontFaces();

getSync(["fontEnabled", "spacingEnabled"]).then((result) => {
  if (result.fontEnabled !== false) enableFont();
  if (result.spacingEnabled) enableSpacing();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const actions = { enableFont, disableFont, enableSpacing, disableSpacing };
  const handler = actions[message.action];
  if (handler) handler();
  sendResponse({ success: true });
  return true;
});

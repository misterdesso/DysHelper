import { describe, it, expect, beforeEach, vi } from "vitest";
import { sendToActiveTab } from "../src/shared/messaging.js";

describe("sendToActiveTab", () => {
  beforeEach(() => {
    chrome.tabs.query.mockClear();
    chrome.tabs.sendMessage.mockClear();
  });

  it("sends message to the active tab", async () => {
    chrome.tabs.query.mockImplementation((_, cb) => cb([{ id: 42 }]));
    chrome.tabs.sendMessage.mockImplementation((_, __, cb) =>
      cb && cb({ success: true }),
    );

    const result = await sendToActiveTab({ action: "enableFont" });

    expect(chrome.tabs.query).toHaveBeenCalledWith(
      { active: true, currentWindow: true },
      expect.any(Function),
    );
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
      42,
      { action: "enableFont" },
      expect.any(Function),
    );
    expect(result).toEqual({ success: true });
  });

  it("resolves null when no active tab exists", async () => {
    chrome.tabs.query.mockImplementation((_, cb) => cb([]));

    const result = await sendToActiveTab({ action: "enableFont" });

    expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});

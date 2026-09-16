import { describe, it, expect, beforeEach } from "vitest";
import { sendToActiveTab, getActiveTab } from "../src/shared/messaging.js";

describe("sendToActiveTab", () => {
  beforeEach(() => {
    chrome.tabs.query.mockClear();
    chrome.tabs.sendMessage.mockClear();
  });

  it("sends message to the active tab", async () => {
    chrome.tabs.query.mockImplementation((_, cb) => cb([{ id: 42 }]));
    chrome.tabs.sendMessage.mockImplementation(
      (_, __, cb) => cb && cb({ success: true }),
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

describe("getActiveTab", () => {
  beforeEach(() => {
    chrome.tabs.query.mockClear();
  });

  it("resolves with the active tab", async () => {
    const tab = { id: 7, url: "https://example.com/page" };
    chrome.tabs.query.mockImplementation((_, cb) => cb([tab]));

    const result = await getActiveTab();

    expect(chrome.tabs.query).toHaveBeenCalledWith(
      { active: true, currentWindow: true },
      expect.any(Function),
    );
    expect(result).toBe(tab);
  });

  it("resolves null when there is no active tab", async () => {
    chrome.tabs.query.mockImplementation((_, cb) => cb([]));

    const result = await getActiveTab();

    expect(result).toBeNull();
  });
});

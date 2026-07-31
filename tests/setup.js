import { vi } from "vitest";

function createStorageMock() {
  let store = {};

  return {
    get: vi.fn(function (keys, cb) {
      const result = {};
      const keyList = Array.isArray(keys) ? keys : [keys];
      keyList.forEach((k) => {
        if (k in store) result[k] = store[k];
      });
      if (cb) cb(result);
      return Promise.resolve(result);
    }),
    set: vi.fn(function (items, cb) {
      Object.assign(store, items);
      if (cb) cb();
      return Promise.resolve();
    }),
    remove: vi.fn(function (keys, cb) {
      const keyList = Array.isArray(keys) ? keys : [keys];
      keyList.forEach((k) => delete store[k]);
      if (cb) cb();
      return Promise.resolve();
    }),
    get _store() {
      return store;
    },
    _reset(data = {}) {
      store = { ...data };
    },
  };
}

global.chrome = {
  storage: {
    sync: createStorageMock(),
    local: createStorageMock(),
  },
  runtime: {
    id: "test-extension-id",
    lastError: null,
    getURL: vi.fn((path) => `chrome-extension://test-extension-id/${path}`),
    onMessage: {
      addListener: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn((_, cb) => cb([{ id: 1 }])),
    sendMessage: vi.fn((_, __, cb) => cb && cb({ success: true })),
    create: vi.fn(),
  },
};

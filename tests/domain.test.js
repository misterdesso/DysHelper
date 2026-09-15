import { describe, it, expect } from "vitest";
import { getBaseDomain } from "../src/shared/domain.js";

describe("getBaseDomain", () => {
  it("strips a leading www.", () => {
    expect(getBaseDomain("www.example.com")).toBe("example.com");
  });

  it("returns a simple two-label domain unchanged", () => {
    expect(getBaseDomain("example.com")).toBe("example.com");
  });

  it("collapses subdomains to the base domain", () => {
    expect(getBaseDomain("news.example.com")).toBe("example.com");
    expect(getBaseDomain("a.b.c.example.com")).toBe("example.com");
  });

  it("handles known multi-part suffixes", () => {
    expect(getBaseDomain("www.bbc.co.uk")).toBe("bbc.co.uk");
    expect(getBaseDomain("news.bbc.co.uk")).toBe("bbc.co.uk");
    expect(getBaseDomain("straitstimes.com.sg")).toBe("straitstimes.com.sg");
    expect(getBaseDomain("www.straitstimes.com.sg")).toBe(
      "straitstimes.com.sg",
    );
  });

  it("falls back to last two labels for unknown multi-part TLDs", () => {
    expect(getBaseDomain("sub.example.unknown.tld")).toBe("unknown.tld");
  });

  it("returns an IPv4 address unchanged", () => {
    expect(getBaseDomain("192.168.0.1")).toBe("192.168.0.1");
  });

  it("returns localhost unchanged", () => {
    expect(getBaseDomain("localhost")).toBe("localhost");
  });

  it("returns a single-label hostname unchanged", () => {
    expect(getBaseDomain("myhost")).toBe("myhost");
  });

  it("is case-insensitive", () => {
    expect(getBaseDomain("WWW.Example.COM")).toBe("example.com");
  });

  it("returns falsy input unchanged", () => {
    expect(getBaseDomain("")).toBe("");
    expect(getBaseDomain(undefined)).toBe(undefined);
  });
});

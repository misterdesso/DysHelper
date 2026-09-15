// Curated set of multi-part public suffixes that need three labels
// (e.g. "example.com.sg" -> base domain, not "com.sg"). Not exhaustive —
// covers common cases without bundling the full Public Suffix List.
const MULTI_PART_SUFFIXES = new Set([
  "co.uk",
  "org.uk",
  "gov.uk",
  "ac.uk",
  "com.sg",
  "edu.sg",
  "gov.sg",
  "com.au",
  "net.au",
  "org.au",
  "gov.au",
  "co.jp",
  "co.nz",
  "co.in",
  "co.za",
  "com.br",
  "com.cn",
  "com.hk",
  "com.tw",
]);

const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/;

/**
 * Derives a "base domain" from a hostname, so subdomains share one entry.
 * e.g. "www.example.com" -> "example.com"
 *      "news.bbc.co.uk"  -> "bbc.co.uk"
 *      "localhost"       -> "localhost"
 *      "192.168.0.1"     -> "192.168.0.1"
 *
 * This is a heuristic, not a full Public Suffix List implementation.
 * Uncommon multi-part TLDs not in MULTI_PART_SUFFIXES fall back to the
 * last two labels.
 */
export function getBaseDomain(hostname) {
  if (!hostname) return hostname;

  const host = hostname.toLowerCase();

  if (IP_PATTERN.test(host) || host === "localhost") {
    return host;
  }

  const withoutWww = host.startsWith("www.") ? host.slice(4) : host;

  const labels = withoutWww.split(".");
  if (labels.length <= 2) {
    return withoutWww;
  }

  const lastTwo = labels.slice(-2).join(".");
  if (MULTI_PART_SUFFIXES.has(lastTwo)) {
    return labels.slice(-3).join(".");
  }

  return lastTwo;
}

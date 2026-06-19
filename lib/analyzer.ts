import { SecurityFinding } from "@/types/security";

const SUSPICIOUS_KEYWORDS = [
  "login", "verify", "secure", "update", "banking",
  "confirm", "account", "password", "signin", "authentication",
  "validate", "credential", "ebayisapi", "webscr",
];

const SUSPICIOUS_TLDS = [".xyz", ".top", ".click", ".tk", ".ml", ".ga", ".cf", ".pw", ".gq"];

const URL_SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "shorturl.at",
  "goo.gl", "ow.ly", "buff.ly", "rebrand.ly",
];

export function analyzeUrl(rawUrl: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];

  // Normalize URL
  let url = rawUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return [
      {
        id: "invalid_url",
        label: "Invalid URL Format",
        description: "The URL could not be parsed. It may be malformed.",
        severity: "high",
        points: 30,
      },
    ];
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullUrl = url.toLowerCase();

  // Rule 1: No HTTPS
  if (parsed.protocol !== "https:") {
    findings.push({
      id: "no_https",
      label: "No HTTPS Encryption",
      description: "Connection is unencrypted. Credentials can be intercepted.",
      severity: "high",
      points: 20,
    });
  }

  // Rule 2: IP address URL
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(hostname)) {
    findings.push({
      id: "ip_address",
      label: "IP Address as Domain",
      description: "Legitimate sites use domain names, not raw IP addresses.",
      severity: "high",
      points: 25,
    });
  }

  // Rule 3: Suspicious keywords
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) =>
    fullUrl.includes(kw)
  );
  if (foundKeywords.length > 0) {
    findings.push({
      id: "suspicious_keywords",
      label: `Suspicious Keywords Detected`,
      description: `Contains phishing-associated terms: ${foundKeywords.slice(0, 3).join(", ")}${foundKeywords.length > 3 ? "..." : ""}`,
      severity: foundKeywords.length > 2 ? "high" : "medium",
      points: Math.min(foundKeywords.length * 8, 24),
    });
  }

  // Rule 4: Excessive hyphens
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    findings.push({
      id: "excessive_hyphens",
      label: "Excessive Hyphens in Domain",
      description: `Domain contains ${hyphenCount} hyphens — a common typosquatting tactic.`,
      severity: "medium",
      points: 15,
    });
  }

  // Rule 5: Very long URL
  if (rawUrl.length > 100) {
    findings.push({
      id: "long_url",
      label: "Unusually Long URL",
      description: `URL is ${rawUrl.length} characters. Long URLs obscure the true destination.`,
      severity: "medium",
      points: 10,
    });
  }

  // Rule 6: Suspicious TLD
  const suspiciousTld = SUSPICIOUS_TLDS.find((tld) => hostname.endsWith(tld));
  if (suspiciousTld) {
    findings.push({
      id: "suspicious_tld",
      label: `Suspicious TLD: ${suspiciousTld}`,
      description: "This top-level domain is commonly associated with phishing campaigns.",
      severity: "high",
      points: 20,
    });
  }

  // Rule 7: @ symbol in URL
  if (fullUrl.includes("@")) {
    findings.push({
      id: "at_symbol",
      label: "@ Symbol in URL",
      description: "The @ symbol redirects browsers to the part after it, masking the real destination.",
      severity: "high",
      points: 25,
    });
  }

  // Rule 8: Multiple subdomains
  const parts = hostname.split(".");
  if (parts.length > 4) {
    findings.push({
      id: "multiple_subdomains",
      label: "Multiple Subdomains",
      description: `Domain has ${parts.length - 2} subdomain levels — a tactic to imitate trusted domains.`,
      severity: "medium",
      points: 15,
    });
  }

  // Rule 9: URL shortener
  const isShortener = URL_SHORTENERS.some((s) => hostname.includes(s));
  if (isShortener) {
    findings.push({
      id: "url_shortener",
      label: "URL Shortening Service",
      description: "Shortened URLs mask the true destination and are frequently used in phishing.",
      severity: "medium",
      points: 15,
    });
  }

  return findings;
}

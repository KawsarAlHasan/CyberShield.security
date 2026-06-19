import { AnalysisResult, RiskLevel, SecurityFinding } from "@/types/security";
import { analyzeUrl } from "./analyzer";

function getRecommendations(level: RiskLevel, findings: SecurityFinding[]): string[] {
  const base: string[] = [];

  if (findings.some((f) => f.id === "no_https")) {
    base.push("Never enter passwords or payment info on HTTP sites");
  }
  if (findings.some((f) => f.id === "ip_address")) {
    base.push("Avoid sites using raw IP addresses — verify the domain owner");
  }
  if (findings.some((f) => f.id === "url_shortener")) {
    base.push("Expand shortened URLs using a preview service before visiting");
  }
  if (findings.some((f) => f.id === "suspicious_keywords")) {
    base.push("Cross-check the domain with the official organization's website");
  }
  if (findings.some((f) => f.id === "at_symbol")) {
    base.push("The real destination is hidden after the @ — do not visit this URL");
  }

  if (level === "HIGH") {
    return [
      "Do not visit this URL — treat it as malicious",
      "Report it to your security team or phishing databases",
      "Do not enter any credentials or personal information",
      ...base,
    ];
  }
  if (level === "MEDIUM") {
    return [
      "Proceed with extreme caution",
      "Verify the domain legitimacy before interacting",
      ...base,
      "Check the site's SSL certificate details",
    ];
  }
  return [
    "URL appears relatively safe, but always stay vigilant",
    "Ensure the page content matches the expected site",
    ...base,
  ];
}

export function calculateRisk(rawUrl: string): AnalysisResult {
  const findings = analyzeUrl(rawUrl);
  const rawScore = findings.reduce((sum, f) => sum + f.points, 0);
  const score = Math.min(rawScore, 100);

  let level: RiskLevel;
  if (score <= 30) level = "LOW";
  else if (score <= 60) level = "MEDIUM";
  else level = "HIGH";

  return {
    url: rawUrl,
    score,
    level,
    findings,
    recommendations: getRecommendations(level, findings),
    analyzedAt: new Date(),
  };
}

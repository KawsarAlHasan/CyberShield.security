export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface SecurityFinding {
  id: string;
  label: string;
  description: string;
  severity: "low" | "medium" | "high";
  points: number;
}

export interface AnalysisResult {
  url: string;
  score: number;
  level: RiskLevel;
  findings: SecurityFinding[];
  recommendations: string[];
  analyzedAt: Date;
}

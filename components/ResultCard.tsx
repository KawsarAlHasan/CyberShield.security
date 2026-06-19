"use client";

import { AnalysisResult } from "@/types/security";
import RiskBadge from "./RiskBadge";
import FindingsList from "./FindingsList";
import RecommendationList from "./RecommendationList";
import { useState } from "react";

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = [
      `CyberShield Analysis Report`,
      `URL: ${result.url}`,
      `Risk Score: ${result.score}/100`,
      `Threat Level: ${result.level}`,
      ``,
      `FINDINGS (${result.findings.length}):`,
      ...result.findings.map(
        (f) => `• ${f.label} [${f.severity.toUpperCase()}]`,
      ),
      ``,
      `RECOMMENDATIONS:`,
      ...result.recommendations.map((r, i) => `${i + 1}. ${r}`),
      ``,
      `Analyzed at: ${result.analyzedAt.toLocaleString()}`,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Analyzed URL bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] ring-1 ring-white/10 overflow-hidden">
        <span className="text-cyan-500 flex-shrink-0">🔗</span>
        <span className="text-xs text-slate-300 font-mono truncate">
          {result.url}
        </span>
        <span className="ml-auto text-[10px] text-slate-500 flex-shrink-0 font-mono">
          {result.analyzedAt.toLocaleTimeString()}
        </span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Risk Badge */}
        <div className="flex flex-col items-center justify-center">
          <RiskBadge level={result.level} score={result.score} />
        </div>

        {/* Right: Findings */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            Security Findings ({result.findings.length})
          </h3>
          <FindingsList findings={result.findings} />
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="p-4 rounded-xl bg-white/[0.03] ring-1 ring-white/10 space-y-3">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            Recommendations
          </h3>
          <RecommendationList recommendations={result.recommendations} />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.05] hover:bg-white/[0.09] ring-1 ring-white/10 text-slate-300 transition-all"
        >
          {copied ? (
            <>
              <span>✓</span> Copied!
            </>
          ) : (
            <>
              <span>📋</span> Copy Report
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-cyan-500/10 hover:bg-cyan-500/20 ring-1 ring-cyan-500/30 text-cyan-400 transition-all"
        >
          <span>↺</span> Scan Another
        </button>
      </div>
    </div>
  );
}

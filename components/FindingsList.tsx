import { SecurityFinding } from "@/types/security";

interface FindingsListProps {
  findings: SecurityFinding[];
}

const severityConfig = {
  high: { dot: "bg-red-500", text: "text-red-400", badge: "bg-red-500/15 ring-red-500/40 text-red-300" },
  medium: { dot: "bg-amber-400", text: "text-amber-400", badge: "bg-amber-500/15 ring-amber-500/40 text-amber-300" },
  low: { dot: "bg-emerald-400", text: "text-emerald-400", badge: "bg-emerald-500/15 ring-emerald-500/40 text-emerald-300" },
};

export default function FindingsList({ findings }: FindingsListProps) {
  if (findings.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
        <span className="text-2xl">🛡️</span>
        <div>
          <p className="font-semibold text-emerald-400">No Threats Detected</p>
          <p className="text-sm text-slate-400">URL passed all security heuristic checks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {findings.map((finding, i) => {
        const s = severityConfig[finding.severity];
        return (
          <div
            key={finding.id}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] ring-1 ring-white/10 hover:bg-white/[0.06] transition-colors"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="mt-1 flex-shrink-0">
              <div className={`w-2 h-2 rounded-full ${s.dot} ring-2 ring-white/10 shadow-lg`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-200">{finding.label}</span>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ring-1 ${s.badge}`}>
                  {finding.severity}
                </span>
                <span className="ml-auto text-xs font-mono text-slate-500">+{finding.points}pts</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{finding.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

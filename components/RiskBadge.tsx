import { RiskLevel } from "@/types/security";

interface RiskBadgeProps {
  level: RiskLevel;
  score: number;
}

const config = {
  LOW: {
    label: "LOW RISK",
    ring: "ring-emerald-500/60",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.35)]",
    text: "text-emerald-400",
    bar: "from-emerald-600 to-emerald-400",
    bg: "bg-emerald-500/10",
    icon: "✓",
  },
  MEDIUM: {
    label: "MEDIUM RISK",
    ring: "ring-amber-500/60",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.35)]",
    text: "text-amber-400",
    bar: "from-amber-600 to-amber-400",
    bg: "bg-amber-500/10",
    icon: "⚠",
  },
  HIGH: {
    label: "HIGH RISK",
    ring: "ring-red-500/60",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    text: "text-red-400",
    bar: "from-red-700 to-red-400",
    bg: "bg-red-500/10",
    icon: "✕",
  },
};

export default function RiskBadge({ level, score }: RiskBadgeProps) {
  const c = config[level];

  return (
    <div className={`flex flex-col items-center gap-4 p-6 rounded-2xl ring-2 ${c.ring} ${c.glow} ${c.bg}`}>
      {/* Score circle */}
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 263.9} 263.9`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={level === "HIGH" ? "stop-red-700" : level === "MEDIUM" ? "stop-amber-600" : "stop-emerald-600"} stopColor={level === "HIGH" ? "#b91c1c" : level === "MEDIUM" ? "#d97706" : "#059669"} />
              <stop offset="100%" stopColor={level === "HIGH" ? "#f87171" : level === "MEDIUM" ? "#fbbf24" : "#34d399"} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black ${c.text}`}>{score}</span>
          <span className="text-xs text-slate-400 font-mono">/100</span>
        </div>
      </div>

      {/* Level badge */}
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ring-1 ${c.ring} ${c.bg}`}>
        <span className={`text-sm font-bold tracking-widest ${c.text}`}>{c.label}</span>
      </div>
    </div>
  );
}

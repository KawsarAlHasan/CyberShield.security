interface RecommendationListProps {
  recommendations: string[];
}

export default function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <ul className="space-y-2">
      {recommendations.map((rec, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
        >
          <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 ring-1 ring-cyan-500/40 flex items-center justify-center text-[10px] font-bold text-cyan-400">
            {i + 1}
          </span>
          {rec}
        </li>
      ))}
    </ul>
  );
}

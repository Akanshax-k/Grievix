import { Tag, TrendingUp } from "lucide-react";

interface AIAnalysisCardProps {
  aiAnalysis: {
    confidenceScore: number;
    imageLabels: string[];
  };
}

export default function AIAnalysisCard({ aiAnalysis }: AIAnalysisCardProps) {
  const { confidenceScore, imageLabels } = aiAnalysis;

  const confidence =
    confidenceScore >= 80
      ? { level: "High", bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" }
      : confidenceScore >= 60
      ? { level: "Medium", bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" }
      : { level: "Low", bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50", border: "border-red-200" };

  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
        AI Analysis
      </h3>

      {/* Confidence score */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-muted-foreground">Confidence</span>
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {confidenceScore}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5 mb-2">
          <div
            className={`h-1.5 rounded-full transition-all ${confidence.bar}`}
            style={{ width: `${confidenceScore}%` }}
          />
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${confidence.bg} ${confidence.text} ${confidence.border}`}
        >
          <TrendingUp className="w-3 h-3" />
          {confidence.level}
        </div>
      </div>

      {/* Labels */}
      {imageLabels?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Detected Labels
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {imageLabels.map((label, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-muted rounded text-xs text-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

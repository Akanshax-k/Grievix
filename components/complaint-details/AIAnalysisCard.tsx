import { Brain, Tag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AIAnalysisCardProps {
  aiAnalysis: {
    confidenceScore: number;
    imageLabels: string[];
  };
}

export default function AIAnalysisCard({ aiAnalysis }: AIAnalysisCardProps) {
  const { confidenceScore, imageLabels } = aiAnalysis;

  // Determine confidence level and color
  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { level: "High", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score >= 60) return { level: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { level: "Low", color: "text-red-700 bg-red-50 border-red-200" };
  };

  const confidenceInfo = getConfidenceLevel(confidenceScore);

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">AI Analysis</h3>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Confidence Score</span>
            <span className="text-2xl font-bold text-gray-900">{confidenceScore}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${
                confidenceScore >= 80
                  ? "bg-emerald-500"
                  : confidenceScore >= 60
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${confidenceScore}%` }}
            ></div>
          </div>

          {/* Confidence Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${confidenceInfo.color}`}>
            <TrendingUp className="w-4 h-4" />
            {confidenceInfo.level} Confidence
          </div>
        </div>

        {/* Image Labels */}
        {imageLabels && imageLabels.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Detected Labels</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {imageLabels.map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Info Text */}
        <p className="text-xs text-gray-500 italic">
          AI-powered image analysis helps categorize and assess complaint severity automatically.
        </p>
      </CardContent>
    </Card>
  );
}

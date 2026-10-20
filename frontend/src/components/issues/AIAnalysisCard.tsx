import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAnalysisCardProps {
  summary: string;
  className?: string;
  compact?: boolean;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  summary,
  className,
  compact = false,
}) => {
  // Strip redundant "AI Summary:" prefix if already in data for clean presentation
  const cleanSummary = summary.replace(/^AI Summary:\s*/i, "");

  return (
    <div
      className={cn(
        "rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50/60 via-slate-50/40 to-teal-50/40 p-3 text-slate-700 transition-all",
        compact ? "py-2.5 px-3 text-xs" : "p-3.5 text-xs sm:text-[13px]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 font-semibold text-emerald-900 mb-1">
        <Sparkles className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
        <span className="text-[11px] uppercase tracking-wider font-bold">AI Civic Summary</span>
      </div>
      <p className="text-slate-600 leading-relaxed font-normal">
        {cleanSummary}
      </p>
    </div>
  );
};

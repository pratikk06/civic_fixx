import React from "react";
import { ResolutionAssessment } from "@/types";
import { CheckCircle2, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ResolutionCardProps {
  resolution?: ResolutionAssessment;
}

export const ResolutionCard: React.FC<ResolutionCardProps> = ({ resolution }) => {
  if (!resolution) return null;

  return (
    <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Issue Resolved</h3>
            <p className="text-[11px] text-emerald-800 font-medium">
              Verified with photographic evidence on {formatDate(resolution.completedAt)}
            </p>
          </div>
        </div>

        {resolution.score && (
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Visual Score</span>
            <span className="text-lg font-black text-emerald-700">{resolution.score}%</span>
          </div>
        )}
      </div>

      {/* Before / After Photo Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resolution.beforeImageUrl && (
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">BEFORE</span>
            <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={resolution.beforeImageUrl} alt="Before repair" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {resolution.afterImageUrl && (
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">AFTER (REPAIRED)</span>
            <div className="aspect-4/3 rounded-xl overflow-hidden border-2 border-emerald-500 bg-slate-100 shadow-xs">
              <img src={resolution.afterImageUrl} alt="After repair evidence" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>

      {/* AI Resolution Assessment Details */}
      <div className="rounded-xl border border-emerald-200 bg-white/90 p-3.5 space-y-1.5 text-xs text-slate-700">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          AI-Assisted Resolution Assessment
        </div>
        <p className="text-slate-600 leading-relaxed">{resolution.summary}</p>
        <p className="text-[10px] text-slate-400 font-medium italic pt-1 border-t border-slate-100">
          {resolution.disclaimer || "AI-assisted assessment based on submitted visual evidence."}
        </p>
      </div>
    </div>
  );
};

import React from "react";
import { Building2, Calendar } from "lucide-react";
import { OfficialUpdate } from "@/types";
import { cn } from "@/lib/utils";

interface OfficialUpdateCardProps {
  update: OfficialUpdate;
  className?: string;
}

export const OfficialUpdateCard: React.FC<OfficialUpdateCardProps> = ({ update, className }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/40 p-3.5 text-xs space-y-2 shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-blue-100/80 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-blue-900">
          <Building2 className="h-3.5 w-3.5 text-blue-700 flex-shrink-0" />
          <span>Latest Official Authority Update</span>
        </div>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200">
          Official
        </span>
      </div>

      <p className="text-slate-700 leading-relaxed font-medium">
        &ldquo;{update.message}&rdquo;
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-700">{update.authorName}</span>
          {update.authorRole && (
            <span className="text-slate-400 font-normal">({update.authorRole})</span>
          )}
        </div>

        {update.expectedCompletionDate && (
          <div className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            <Calendar className="h-3 w-3 text-emerald-600" />
            <span>Target: {new Date(update.expectedCompletionDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

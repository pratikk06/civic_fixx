import React from "react";
import { Building2, ArrowRight, Calendar, CheckCircle2 } from "lucide-react";

interface AuthorityActionSectionProps {
  department: string;
  whatHappened?: string;
  whatIsHappeningNow?: string;
  whatHappensNext?: string;
  expectedCompletion?: string;
}

export const AuthorityActionSection: React.FC<AuthorityActionSectionProps> = ({
  department,
  whatHappened,
  whatIsHappeningNow,
  whatHappensNext,
  expectedCompletion,
}) => {
  const hasUpdates = whatHappened || whatIsHappeningNow || whatHappensNext;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-indigo-600" />
          What Authorities Are Doing
        </h3>
        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
          {department}
        </span>
      </div>

      {!hasUpdates ? (
        <p className="text-xs text-slate-500 italic">No official update has been posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {whatHappened && (
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                WHAT HAPPENED
              </span>
              <p className="text-slate-700 font-medium leading-relaxed">{whatHappened}</p>
            </div>
          )}

          {whatIsHappeningNow && (
            <div className="rounded-xl bg-amber-50/80 p-3 border border-amber-200/80 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-amber-600" />
                WHAT IS HAPPENING NOW
              </span>
              <p className="text-slate-800 font-semibold leading-relaxed">{whatIsHappeningNow}</p>
            </div>
          )}

          {whatHappensNext && (
            <div className="rounded-xl bg-indigo-50/80 p-3 border border-indigo-200/80 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 block flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-indigo-600" />
                WHAT HAPPENS NEXT
              </span>
              <p className="text-slate-700 font-medium leading-relaxed">{whatHappensNext}</p>
            </div>
          )}
        </div>
      )}

      {expectedCompletion && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
          <Calendar className="h-3.5 w-3.5 text-indigo-600" />
          <span>Expected Completion:</span>
          <span className="text-indigo-700">{expectedCompletion}</span>
        </div>
      )}
    </div>
  );
};

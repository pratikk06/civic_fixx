import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CivicIssue } from "@/types";

interface ReportSuccessModalProps {
  issue: CivicIssue;
  onViewIssue: () => void;
  onGoHome: () => void;
}

export const ReportSuccessModal: React.FC<ReportSuccessModalProps> = ({
  issue,
  onViewIssue,
  onGoHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5 animate-scale-up">
        {/* Animated Check Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-md">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Official Public Post Live
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-2">
            Civic Issue Published!
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your report has been broadcast to the public feed and dispatched to <strong>{issue.department}</strong>.
          </p>
        </div>

        {/* Issue Details Card */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Issue Reference:</span>
            <span className="font-mono text-emerald-800 font-bold">#{issue.id}</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{issue.title}</h4>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>{issue.location.locality}</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">{issue.reporter.name}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2 pt-2">
          <Button
            type="button"
            variant="civic"
            size="lg"
            onClick={onViewIssue}
            className="w-full font-bold shadow-md shadow-emerald-600/20"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            View Live Public Post
          </Button>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onGoHome}
            className="w-full text-xs font-semibold"
          >
            Back to Public Feed
          </Button>
        </div>
      </div>
    </div>
  );
};

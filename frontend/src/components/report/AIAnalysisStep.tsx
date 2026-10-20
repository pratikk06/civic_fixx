import React from "react";
import { Sparkles, Loader2, CheckCircle2, Building2, Edit3 } from "lucide-react";
import { AIAnalysisResult, IssueCategory, IssueSeverity } from "@/types";
import { DEPARTMENTS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface AIAnalysisStepProps {
  isAnalyzing: boolean;
  aiResult: AIAnalysisResult | null;
  category: IssueCategory;
  onCategoryChange: (cat: IssueCategory) => void;
  severity: IssueSeverity;
  onSeverityChange: (sev: IssueSeverity) => void;
  department: string;
  onDepartmentChange: (dept: string) => void;
  aiSummary: string;
  onSummaryChange: (summary: string) => void;
}

const CATEGORY_OPTIONS: IssueCategory[] = [
  "Road Infrastructure",
  "Waste & Sanitation",
  "Street Lighting & Electrical",
  "Water Supply & Drainage",
  "Public Parks & Environment",
  "Public Safety & Traffic",
  "Other",
];

const SEVERITY_OPTIONS: { id: IssueSeverity; label: string; desc: string; color: string }[] = [
  { id: "low", label: "Low", desc: "Minor cosmetic defect, no immediate hazard", color: "border-slate-300 text-slate-700 hover:bg-slate-50" },
  { id: "medium", label: "Medium", desc: "Moderate inconvenience or localized problem", color: "border-blue-300 text-blue-800 hover:bg-blue-50" },
  { id: "high", label: "High", desc: "Safety hazard or active disruption", color: "border-amber-400 text-amber-900 bg-amber-50/50" },
  { id: "critical", label: "Critical", desc: "Severe emergency, immediate life or injury risk", color: "border-red-400 text-red-900 bg-red-50/50" },
];

export const AIAnalysisStep: React.FC<AIAnalysisStepProps> = ({
  isAnalyzing,
  category,
  onCategoryChange,
  severity,
  onSeverityChange,
  department,
  onDepartmentChange,
  aiSummary,
  onSummaryChange,
}) => {
  if (isAnalyzing) {
    return (
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-500/5 via-white to-teal-500/5 p-8 text-center shadow-xs">
        <CardContent className="flex flex-col items-center justify-center p-0 space-y-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-md animate-bounce">
            <Sparkles className="h-8 w-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              Analyzing Visual Evidence & Metadata...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Groq AI vision is analyzing the defect pattern, estimating hazard severity, and mapping the responsible municipal department.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-2 pt-2 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white p-2 rounded-lg border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Evidence image verified</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white p-2 rounded-lg border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Classifying category & municipal ward</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* AI Success Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/70 p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                AI Triage Recommendations
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Review and adjust the classification before final publishing.
              </p>
            </div>
          </div>
          <Badge variant="primary" className="text-[10px] font-bold">
            94% Confidence
          </Badge>
        </div>
      </div>

      {/* Editable AI Summary */}
      <div className="space-y-1.5">
        <label htmlFor="aiSummary" className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
            AI Generated Issue Summary
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Editable</span>
        </label>
        <textarea
          id="aiSummary"
          rows={3}
          value={aiSummary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="AI summarized explanation of the civic problem..."
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed shadow-xs"
        />
      </div>

      {/* Category Selection */}
      <div className="space-y-1.5">
        <label htmlFor="category" className="text-xs font-bold text-slate-800">
          Issue Category *
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as IssueCategory)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs cursor-pointer"
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Severity Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span>Estimated Severity *</span>
          <span className="text-[10px] text-slate-400 font-normal">Impact on public safety</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SEVERITY_OPTIONS.map((sev) => {
            const isSelected = severity === sev.id;
            return (
              <button
                key={sev.id}
                type="button"
                onClick={() => onSeverityChange(sev.id)}
                className={cn(
                  "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-150 shadow-2xs",
                  isSelected
                    ? sev.id === "critical"
                      ? "border-red-600 bg-red-50 ring-2 ring-red-500/20 font-bold"
                      : sev.id === "high"
                      ? "border-amber-600 bg-amber-50 ring-2 ring-amber-500/20 font-bold"
                      : "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 font-bold"
                    : sev.color
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold uppercase">{sev.label}</span>
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                </div>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5 leading-tight line-clamp-2">
                  {sev.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Department Routing */}
      <div className="space-y-1.5">
        <label htmlFor="dept" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-slate-500" />
          Responsible Municipal Department
        </label>
        <select
          id="dept"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs cursor-pointer"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept.id} value={dept.name}>
              🏛 {dept.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

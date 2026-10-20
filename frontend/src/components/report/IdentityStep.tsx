import React from "react";
import { User, Shield, CheckCircle2, MapPin, Eye, EyeOff } from "lucide-react";
import { IssueCategory, IssueSeverity, IssueLocation } from "@/types";
import { SeverityBadge } from "@/components/issues/SeverityBadge";
import { IssueStatusBadge } from "@/components/issues/IssueStatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface IdentityStepProps {
  isAnonymous: boolean;
  onAnonymousChange: (isAnon: boolean) => void;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  department: string;
  location: IssueLocation;
  imagePreview: string | null;
  aiSummary: string;
}

export const IdentityStep: React.FC<IdentityStepProps> = ({
  isAnonymous,
  onAnonymousChange,
  title,
  category,
  severity,
  department,
  location,
  imagePreview,
  aiSummary,
}) => {
  return (
    <div className="space-y-5">
      {/* Identity Choice Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800">
          How would you like to post this report?
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Public Profile */}
          <button
            type="button"
            onClick={() => onAnonymousChange(false)}
            className={cn(
              "flex flex-col p-4 rounded-2xl border text-left transition-all duration-150 shadow-2xs",
              !isAnonymous
                ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-900">Public Profile</span>
              </div>
              {!isAnonymous && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Post as <strong>Rinku Diwakar (Civic Contributor)</strong>. Builds your civic community credibility.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-3">
              <Eye className="h-3 w-3" />
              <span>Visible on your profile</span>
            </div>
          </button>

          {/* Anonymous Citizen */}
          <button
            type="button"
            onClick={() => onAnonymousChange(true)}
            className={cn(
              "flex flex-col p-4 rounded-2xl border text-left transition-all duration-150 shadow-2xs",
              isAnonymous
                ? "border-slate-800 bg-slate-900 text-white ring-2 ring-slate-700/50"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-900"
            )}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs",
                  isAnonymous ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                )}>
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold">Anonymous Citizen</span>
              </div>
              {isAnonymous && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            </div>
            <p className={cn("text-xs leading-relaxed", isAnonymous ? "text-slate-300" : "text-slate-600")}>
              Your name and photo will be completely hidden from the public feed and authorities.
            </p>
            <div className={cn("flex items-center gap-1 text-[11px] font-semibold mt-3", isAnonymous ? "text-emerald-400" : "text-slate-500")}>
              <EyeOff className="h-3 w-3" />
              <span>Protected Identity Guaranteed</span>
            </div>
          </button>
        </div>
      </div>

      {/* Final Pre-Publish Summary Card */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">
            Public Post Preview
          </label>
          <span className="text-[11px] text-slate-400">Review before publishing</span>
        </div>

        <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Issue thumbnail"
                  className="h-20 w-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                  No Image
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <IssueStatusBadge status="reported" size="sm" />
                  <SeverityBadge severity={severity} />
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                    {category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                  {title}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{location.locality || "Sector 21, Gurgaon"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
              <span className="font-bold text-slate-800">Department:</span> 🏛 {department}
            </div>

            {aiSummary && (
              <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                &ldquo;{aiSummary}&rdquo;
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

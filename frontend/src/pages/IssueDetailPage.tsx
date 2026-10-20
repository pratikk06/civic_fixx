import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useIssueDetail, useSupportIssue, useFollowIssue } from "@/hooks/useIssues";
import {
  IssueStatusBadge,
  SeverityBadge,
  SupportButton,
  FollowButton,
  IssueImage,
  AIAnalysisCard,
  OfficialUpdateCard,
  TransparencyTimeline,
  ResolutionCard,
  AuthorityActionSection,
} from "@/components/issues";
import { formatDate } from "@/lib/utils";
import { IssueCardSkeleton } from "@/components/ui/LoadingSkeleton";

export const IssueDetailPage: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();

  const { data: issue, isLoading, error } = useIssueDetail(issueId || "");
  const supportMutation = useSupportIssue();
  const followMutation = useFollowIssue();

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <IssueCardSkeleton />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="space-y-4 text-center py-12 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Issue Not Found</h2>
        <p className="text-xs text-slate-500">The requested civic issue post could not be retrieved.</p>
        <Button size="sm" variant="default" onClick={() => navigate("/")}>
          Return to Public Feed
        </Button>
      </div>
    );
  }

  const isResolved = issue.status === "resolved";

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Public Feed
      </button>

      {/* Header & Metadata Badges */}
      <div className="space-y-3 pb-3 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <IssueStatusBadge status={issue.status} />
          <SeverityBadge severity={issue.severity} />
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-800 border border-indigo-200">
            <Building2 className="h-3.5 w-3.5 text-indigo-600" />
            {issue.department}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
          {issue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Reported by <strong className="text-slate-700">{issue.reporter.isAnonymous ? "Anonymous Citizen" : issue.reporter.name}</strong></span>
          <span>·</span>
          <span>{formatDate(issue.createdAt)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
            <MapPin className="h-3.5 w-3.5" />
            {issue.location.locality || issue.location.address}
          </span>
        </div>
      </div>

      {/* Public Importance Priority Indicator */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white font-bold">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Public Importance: <span className="text-amber-800 font-black">{issue.publicImportance || "HIGH"}</span></span>
            <span className="text-[11px] text-slate-600">Calculated from {issue.severity.toUpperCase()} severity + {issue.supportCount.toLocaleString()} citizen supporters</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Image */}
      {issue.imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-950">
          <IssueImage src={issue.imageUrl} alt={issue.title} />
        </div>
      )}

      {/* Description */}
      {issue.description && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs space-y-1">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Citizen Report Details</h3>
          <p className="text-slate-800 font-normal">{issue.description}</p>
        </div>
      )}

      {/* AI Analysis Summary */}
      {issue.aiSummary && (
        <AIAnalysisCard summary={issue.aiSummary} />
      )}

      {/* Community Mobilization & Support CTA */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Demonstrate Community Importance</h4>
          <p className="text-xs text-slate-600 font-medium">
            <strong>{issue.supportCount.toLocaleString()}</strong> citizens are supporting this report to accelerate department priority.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <SupportButton
            supportCount={issue.supportCount}
            isSupported={issue.isSupportedByMe}
            onToggle={() => supportMutation.mutate(issue.id)}
            size="default"
            className="flex-1 sm:flex-initial"
          />
          <FollowButton
            isFollowed={issue.isFollowedByMe}
            onToggle={() => followMutation.mutate(issue.id)}
            size="default"
          />
        </div>
      </div>

      {/* What Authorities Are Doing */}
      <AuthorityActionSection
        department={issue.department}
        whatHappened={issue.latestOfficialUpdate ? "Roads Department inspected location." : undefined}
        whatIsHappeningNow={issue.latestOfficialUpdate?.message}
        whatHappensNext={issue.latestOfficialUpdate?.actionTaken}
        expectedCompletion={issue.latestOfficialUpdate?.expectedCompletionDate}
      />

      {/* Latest Official Update Card */}
      {issue.latestOfficialUpdate && (
        <OfficialUpdateCard update={issue.latestOfficialUpdate} />
      )}

      {/* Transparency Timeline */}
      <TransparencyTimeline events={issue.timeline} />

      {/* Resolution Section (If Resolved) */}
      {isResolved && issue.resolution && (
        <ResolutionCard resolution={issue.resolution} />
      )}
    </div>
  );
};

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCheck, Shield, Share2, ArrowUpRight } from "lucide-react";
import { CivicIssue } from "@/types";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { IssueStatusBadge } from "./IssueStatusBadge";
import { SeverityBadge } from "./SeverityBadge";
import { DepartmentBadge } from "./DepartmentBadge";
import { SupportButton } from "./SupportButton";
import { FollowButton } from "./FollowButton";
import { LocationDisplay } from "./LocationDisplay";
import { AIAnalysisCard } from "./AIAnalysisCard";
import { OfficialUpdateCard } from "./OfficialUpdateCard";
import { IssueImage } from "./IssueImage";

interface IssueCardProps {
  issue: CivicIssue;
  onSupportToggle?: (issueId: string) => void;
  onFollowToggle?: (issueId: string) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onSupportToggle,
  onFollowToggle,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid triggering card navigation when clicking interactive buttons/links
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    navigate(`/issues/${issue.id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: `CivicFix report: ${issue.title} in ${issue.location.locality}`,
        url: window.location.origin + `/issues/${issue.id}`,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.origin + `/issues/${issue.id}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group cursor-pointer border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-card-hover transition-all duration-200 overflow-hidden"
    >
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Top Row: Reporter Header + Public Status Badge */}
        <div className="flex items-start justify-between gap-3">
          {/* Reporter Profile */}
          <div className="flex items-center gap-3 min-w-0">
            {issue.reporter.isAnonymous ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
                <Shield className="h-5 w-5 text-slate-500" />
              </div>
            ) : issue.reporter.avatarUrl ? (
              <img
                src={issue.reporter.avatarUrl}
                alt={issue.reporter.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm border border-emerald-200 flex-shrink-0">
                {issue.reporter.name.charAt(0)}
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {issue.reporter.isAnonymous ? "Anonymous Citizen" : issue.reporter.name}
                </span>
                {issue.reporter.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-100">
                    <UserCheck className="h-2.5 w-2.5" />
                    {issue.reporter.badge}
                  </span>
                )}
              </div>
              <LocationDisplay
                location={issue.location}
                timeAgo={formatDate(issue.createdAt)}
                className="mt-0.5"
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <IssueStatusBadge status={issue.status} />
          </div>
        </div>

        {/* Issue Title & Description */}
        <div className="space-y-1.5">
          <Link
            to={`/issues/${issue.id}`}
            className="block text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug font-sans"
          >
            {issue.title}
          </Link>
          {issue.description && (
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {issue.description}
            </p>
          )}
        </div>

        {/* Civic Issue Evidence Image */}
        {issue.imageUrl && (
          <IssueImage
            src={issue.imageUrl}
            alt={issue.title}
            category={issue.category}
          />
        )}

        {/* AI Summary Section (Subtle and clean) */}
        {issue.aiSummary && (
          <AIAnalysisCard summary={issue.aiSummary} compact />
        )}

        {/* Classification Tags: Category, Severity, Department */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 border border-slate-200">
            {issue.category}
          </span>
          <SeverityBadge severity={issue.severity} />
          <DepartmentBadge department={issue.department} />
        </div>

        {/* Latest Official Authority Update (if available) */}
        {issue.latestOfficialUpdate && (
          <OfficialUpdateCard update={issue.latestOfficialUpdate} />
        )}

        {/* Action Row: Support, Follow, Share */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <SupportButton
              supportCount={issue.supportCount}
              isSupported={issue.isSupportedByMe}
              onToggle={(e) => {
                e.stopPropagation();
                onSupportToggle?.(issue.id);
              }}
            />
            <FollowButton
              isFollowed={issue.isFollowedByMe}
              onToggle={(e) => {
                e.stopPropagation();
                onFollowToggle?.(issue.id);
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share issue"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <Link
              to={`/issues/${issue.id}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              aria-label="View issue details"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

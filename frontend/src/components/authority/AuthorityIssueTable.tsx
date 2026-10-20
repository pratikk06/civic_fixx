import React from "react";
import { AuthorityIssueItem } from "@/types";
import { IssueStatusBadge } from "@/components/issues/IssueStatusBadge";
import { SeverityBadge } from "@/components/issues/SeverityBadge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, MessageSquare, Flame, MapPin, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AuthorityIssueTableProps {
  issues: AuthorityIssueItem[];
  onAcknowledge: (issueId: string) => void;
  onStartAction: (issueId: string) => void;
  onOpenUpdateModal: (issue: AuthorityIssueItem) => void;
  onOpenResolutionModal: (issue: AuthorityIssueItem) => void;
  onSelectIssue: (issue: AuthorityIssueItem) => void;
}

export const AuthorityIssueTable: React.FC<AuthorityIssueTableProps> = ({
  issues,
  onAcknowledge,
  onStartAction,
  onOpenUpdateModal,
  onOpenResolutionModal,
  onSelectIssue,
}) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
        No active assigned issues in department work queue.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Civic Issue</th>
              <th className="p-3.5">Location</th>
              <th className="p-3.5">Severity</th>
              <th className="p-3.5">Support</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {issues.map((issue) => {
              const isReported = issue.status === "reported";
              const isAcknowledged = issue.status === "acknowledged";
              const isInProgress = issue.status === "action_underway";
              const isResolved = issue.status === "resolved";

              return (
                <tr key={issue.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold">
                    <span className="inline-flex items-center gap-1 text-amber-700 font-black">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      {issue.internalPriorityScore || 85}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => onSelectIssue(issue)}
                      className="font-bold text-slate-900 hover:text-indigo-600 text-left line-clamp-1"
                    >
                      {issue.title}
                    </button>
                    <span className="text-[10px] text-slate-400 block">{formatDate(issue.createdAt)}</span>
                  </td>

                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {issue.location.locality}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <SeverityBadge severity={issue.severity} />
                  </td>

                  <td className="p-3.5 font-bold text-slate-800">
                    {issue.supportCount.toLocaleString()}
                  </td>

                  <td className="p-3.5">
                    <IssueStatusBadge status={issue.status} />
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isReported && (
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => onAcknowledge(issue.id)}>
                          Acknowledge
                        </Button>
                      )}

                      {isAcknowledged && (
                        <Button size="sm" variant="default" className="text-xs h-7 px-2" onClick={() => onStartAction(issue.id)}>
                          Start Work
                        </Button>
                      )}

                      {(isAcknowledged || isInProgress) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2"
                          onClick={() => onOpenUpdateModal(issue)}
                          leftIcon={<MessageSquare className="h-3 w-3" />}
                        >
                          Update
                        </Button>
                      )}

                      {isInProgress && (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2"
                          onClick={() => onOpenResolutionModal(issue)}
                          leftIcon={<CheckCircle2 className="h-3 w-3" />}
                        >
                          Resolve
                        </Button>
                      )}

                      {isResolved && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                          Resolved
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <IssueStatusBadge status={issue.status} />
                <h4 className="font-bold text-slate-900 text-xs mt-1">{issue.title}</h4>
              </div>
              <SeverityBadge severity={issue.severity} />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700">{issue.supportCount.toLocaleString()} Supporters</span>
              <span>Priority Score: {issue.internalPriorityScore || 85}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {issue.status === "reported" && (
                <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => onAcknowledge(issue.id)}>
                  Acknowledge
                </Button>
              )}
              {issue.status === "acknowledged" && (
                <Button size="sm" variant="default" className="text-xs h-7 px-2" onClick={() => onStartAction(issue.id)}>
                  Start Work
                </Button>
              )}
              {(issue.status === "acknowledged" || issue.status === "action_underway") && (
                <Button size="sm" variant="ghost" className="text-xs h-7 px-2" onClick={() => onOpenUpdateModal(issue)}>
                  Post Update
                </Button>
              )}
              {issue.status === "action_underway" && (
                <Button
                  size="sm"
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2"
                  onClick={() => onOpenResolutionModal(issue)}
                >
                  Resolve Issue
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => onSelectIssue(issue)} rightIcon={<ArrowRight className="h-3 w-3" />}>
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

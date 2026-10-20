import React, { useState } from "react";
import { Building2, AlertTriangle, Clock, ShieldAlert, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthorityWorkQueue, useUpdateIssueStatus, usePostOfficialUpdate, useSubmitResolution } from "@/hooks/useAuthority";
import { AuthorityIssueTable } from "@/components/authority/AuthorityIssueTable";
import { AuthorityUpdateModal } from "@/components/authority/AuthorityUpdateModal";
import { ResolutionUploadModal } from "@/components/authority/ResolutionUploadModal";
import { AuthorityIssueItem } from "@/types";
import { useNavigate } from "react-router-dom";

export const AuthorityDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDepartment] = useState<string>("Roads & Public Works");
  const [sortBy, setSortBy] = useState<"priority" | "newest" | "oldest" | "support">("priority");

  const [activeUpdateIssue, setActiveUpdateIssue] = useState<AuthorityIssueItem | null>(null);
  const [activeResolutionIssue, setActiveResolutionIssue] = useState<AuthorityIssueItem | null>(null);

  const { data: queueData, isLoading } = useAuthorityWorkQueue(selectedDepartment);
  const statusMutation = useUpdateIssueStatus();
  const officialUpdateMutation = usePostOfficialUpdate();
  const resolutionMutation = useSubmitResolution();

  const handleAcknowledge = (issueId: string) => {
    statusMutation.mutate({ issueId, status: "acknowledged" });
  };

  const handleStartAction = (issueId: string) => {
    statusMutation.mutate({ issueId, status: "action_in_progress" });
  };

  const handlePostUpdate = (data: { message: string; actionTaken?: string; expectedCompletionDate?: string }) => {
    if (!activeUpdateIssue) return;
    officialUpdateMutation.mutate(
      {
        issueId: activeUpdateIssue.id,
        ...data,
      },
      {
        onSuccess: () => setActiveUpdateIssue(null),
      }
    );
  };

  const handleResolveSubmit = (data: { afterImage: File; summary: string }) => {
    if (!activeResolutionIssue) return;
    resolutionMutation.mutate(
      {
        issueId: activeResolutionIssue.id,
        ...data,
      },
      {
        onSuccess: () => setActiveResolutionIssue(null),
      }
    );
  };

  const issues = queueData?.items || [];
  const stats = queueData?.stats || {
    assignedIssuesCount: issues.length,
    highPriorityCount: issues.filter((i: AuthorityIssueItem) => i.severity === "high" || i.severity === "critical").length,
    awaitingAckCount: issues.filter((i: AuthorityIssueItem) => i.status === "reported").length,
    actionUnderwayCount: issues.filter((i: AuthorityIssueItem) => i.status === "action_underway").length,
    resolvedThisMonthCount: issues.filter((i: AuthorityIssueItem) => i.status === "resolved").length,
  };

  const statCards = [
    { title: "Assigned Issues", value: stats.assignedIssuesCount, icon: Building2, color: "text-slate-900", bg: "bg-slate-50" },
    { title: "High Priority / Critical", value: stats.highPriorityCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { title: "Awaiting Ack", value: stats.awaitingAckCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Action Underway", value: stats.actionUnderwayCount, icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="official">Official Authority Desk</Badge>
            <span className="text-xs text-slate-500 font-medium">{selectedDepartment}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1 font-sans">
            Department Work Queue
          </h1>
        </div>

        <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate("/")}>
          View Public Feed
        </Button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="border-slate-200 shadow-xs">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{s.title}</span>
                  <div className={`p-1.5 rounded-lg ${s.bg}`}>
                    <Icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                </div>
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Work Queue Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-indigo-600" />
          Prioritized Department Queue
        </h3>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 px-2 rounded-lg border border-slate-200 text-xs bg-white font-semibold focus:outline-none"
          >
            <option value="priority">Priority Score</option>
            <option value="support">Most Supported</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Authority Work Queue Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading department queue...</div>
      ) : (
        <AuthorityIssueTable
          issues={issues}
          onAcknowledge={handleAcknowledge}
          onStartAction={handleStartAction}
          onOpenUpdateModal={(issue) => setActiveUpdateIssue(issue)}
          onOpenResolutionModal={(issue) => setActiveResolutionIssue(issue)}
          onSelectIssue={(issue) => navigate(`/issues/${issue.id}`)}
        />
      )}

      {/* Modals */}
      <AuthorityUpdateModal
        issue={activeUpdateIssue}
        isOpen={Boolean(activeUpdateIssue)}
        onClose={() => setActiveUpdateIssue(null)}
        onSubmit={handlePostUpdate}
        isLoading={officialUpdateMutation.isPending}
      />

      <ResolutionUploadModal
        issue={activeResolutionIssue}
        isOpen={Boolean(activeResolutionIssue)}
        onClose={() => setActiveResolutionIssue(null)}
        onSubmit={handleResolveSubmit}
        isLoading={resolutionMutation.isPending}
      />
    </div>
  );
};

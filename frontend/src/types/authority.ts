import { CivicIssue } from "./issue";

export interface AuthorityDashboardStats {
  assignedIssuesCount: number;
  highPriorityCount: number;
  awaitingAckCount: number;
  actionUnderwayCount: number;
  resolvedThisMonthCount: number;
}

export interface OfficialUpdatePayload {
  issueId: string;
  message: string;
  actionTaken?: string;
  expectedCompletionDate?: string;
}

export interface ResolutionPayload {
  issueId: string;
  afterImage: File | string;
  summary: string;
}

export interface AuthorityIssueFilter {
  departmentId?: string;
  status?: string;
  priority?: string;
  sortBy?: "priority" | "newest" | "oldest" | "support";
}

export interface AuthorityIssueItem extends CivicIssue {
  internalPriorityScore?: number;
  assignedTeam?: string;
}

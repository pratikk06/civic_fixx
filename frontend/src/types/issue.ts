export type IssueStatus = "reported" | "acknowledged" | "action_underway" | "resolved";

export type IssueSeverity = "low" | "medium" | "high" | "critical";

export type IssueCategory =
  | "Road Infrastructure"
  | "Waste & Sanitation"
  | "Street Lighting & Electrical"
  | "Water Supply & Drainage"
  | "Public Parks & Environment"
  | "Public Safety & Traffic"
  | "Other";

export interface Reporter {
  id: string;
  name: string;
  avatarUrl?: string;
  badge?: string; // e.g. "Civic Contributor", "Community Leader"
  isAnonymous: boolean;
}

export interface IssueLocation {
  address: string;
  locality: string;
  city?: string;
  state?: string;
  latitude: number;
  longitude: number;
}

export interface AIAnalysisResult {
  category: IssueCategory;
  severity: IssueSeverity;
  suggestedDepartment: string;
  departmentId?: string;
  summary: string;
  keyHazards?: string[];
  confidenceScore?: number;
}

export interface OfficialUpdate {
  id: string;
  authorName: string;
  authorRole: string; // e.g. "Chief Engineer, Roads & Public Works"
  department: string;
  message: string;
  actionTaken?: string;
  expectedCompletionDate?: string;
  createdAt: string;
  isOfficial: boolean;
}

export interface ResolutionAssessment {
  score: number; // 0 - 100
  summary: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  completedAt: string;
  verifiedByAi: boolean;
  disclaimer: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type: "reported" | "ai_analyzed" | "routed" | "acknowledged" | "official_update" | "action_underway" | "resolved";
  actorName?: string;
  isOfficial?: boolean;
}

export interface CivicIssue {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: IssueCategory;
  department: string;
  departmentId?: string;
  severity: IssueSeverity;
  status: IssueStatus;
  location: IssueLocation;
  reporter: Reporter;
  aiSummary: string;
  publicImportance?: "Low" | "Medium" | "High" | "Urgent";
  supportCount: number;
  isSupportedByMe: boolean;
  followCount: number;
  isFollowedByMe: boolean;
  createdAt: string;
  updatedAt: string;
  latestOfficialUpdate?: OfficialUpdate;
  timeline: TimelineEvent[];
  resolution?: ResolutionAssessment;
}

export interface CreateIssuePayload {
  title: string;
  description?: string;
  image: File | string;
  imageUrl?: string;
  category: IssueCategory;
  department?: string;
  severity: IssueSeverity;
  location: IssueLocation;
  isAnonymous: boolean;
  aiSummary?: string;
}

export interface IssueFilterParams {
  tab?: "latest" | "trending" | "nearby";
  category?: string;
  status?: IssueStatus;
  timeframe?: "today" | "week" | "month" | "all";
  radiusKm?: number;
  lat?: number;
  lng?: number;
  limit?: number;
  offset?: number;
}

import { CivicIssue, IssueCategory, IssueStatus, TimelineEvent, OfficialUpdate, ResolutionAssessment } from "@/types";

export const CATEGORY_MAP: Record<string, IssueCategory> = {
  pothole: "Road Infrastructure",
  garbage: "Waste & Sanitation",
  broken_streetlight: "Street Lighting & Electrical",
  water_leakage: "Water Supply & Drainage",
  damaged_infrastructure: "Public Safety & Traffic",
  other: "Other",
  "Road Infrastructure": "Road Infrastructure",
  "Waste & Sanitation": "Waste & Sanitation",
  "Street Lighting & Electrical": "Street Lighting & Electrical",
  "Water Supply & Drainage": "Water Supply & Drainage",
  "Public Parks & Environment": "Public Parks & Environment",
  "Public Safety & Traffic": "Public Safety & Traffic",
  Other: "Other",
};

export const REVERSE_CATEGORY_MAP: Record<string, string> = {
  "Road Infrastructure": "pothole",
  "Waste & Sanitation": "garbage",
  "Street Lighting & Electrical": "broken_streetlight",
  "Water Supply & Drainage": "water_leakage",
  "Public Parks & Environment": "damaged_infrastructure",
  "Public Safety & Traffic": "damaged_infrastructure",
  Other: "other",
};

export const STATUS_MAP: Record<string, IssueStatus> = {
  reported: "reported",
  analyzed: "reported",
  routed: "reported",
  acknowledged: "acknowledged",
  action_in_progress: "action_underway",
  action_underway: "action_underway",
  resolved: "resolved",
};

export function adaptBackendIssueToFrontend(item: any): CivicIssue {
  if (!item) return {} as CivicIssue;

  const cat = CATEGORY_MAP[item.category] || "Other";
  const st = STATUS_MAP[item.status] || "reported";

  let latestUpdate: OfficialUpdate | undefined = undefined;
  if (item.latest_official_update) {
    latestUpdate = {
      id: "latest",
      authorName: item.department_name || "Department Authority",
      authorRole: "Official Department Update",
      department: item.department_name || "Responsible Authority",
      message: typeof item.latest_official_update === "string" ? item.latest_official_update : item.latest_official_update.message,
      createdAt: item.updated_at || item.created_at,
      isOfficial: true,
    };
  }

  let timeline: TimelineEvent[] = [];
  if (Array.isArray(item.timeline)) {
    timeline = item.timeline.map((e: any, idx: number) => ({
      id: `evt-${idx}`,
      title: e.title || "Timeline Event",
      description: e.description,
      timestamp: e.timestamp,
      type: e.event_type ? e.event_type.toLowerCase() : "reported",
      actorName: e.actor_name,
      isOfficial: e.actor_type === "authority",
    }));
  }

  let resolution: ResolutionAssessment | undefined = undefined;
  if (item.resolution_assessment) {
    resolution = {
      score: item.resolution_assessment.resolution_score || 90,
      summary: item.resolution_assessment.explanation || "AI-assisted visual resolution assessment completed.",
      beforeImageUrl: item.before_image_path || "",
      afterImageUrl: item.resolution_assessment.after_image_path || "",
      completedAt: item.resolved_at || item.created_at,
      verifiedByAi: true,
      disclaimer: "AI-assisted resolution assessment based on visual evidence.",
    };
  }

  let rawImg = item.imageUrl || item.before_image_path || item.beforeImagePath || item.image?.path || (typeof item.image === "string" ? item.image : "");
  let resolvedImageUrl = rawImg;

  if (!rawImg) {
    const categoryLower = String(item.category || "").toLowerCase();
    if (categoryLower.includes("garbage") || categoryLower.includes("waste")) {
      resolvedImageUrl = "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop";
    } else if (categoryLower.includes("street") || categoryLower.includes("electric")) {
      resolvedImageUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop";
    } else if (categoryLower.includes("water") || categoryLower.includes("drain")) {
      resolvedImageUrl = "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop";
    } else if (categoryLower.includes("infra") || categoryLower.includes("park") || categoryLower.includes("safety")) {
      resolvedImageUrl = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop";
    } else {
      resolvedImageUrl = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop";
    }
  }

  return {
    id: String(item.id || item._id),
    title: item.title || "Civic Issue",
    description: item.userDescription || item.user_description || item.description || "",
    imageUrl: resolvedImageUrl,
    category: cat,
    department: item.department_name || item.department || "Municipal Public Works",
    departmentId: item.department_id ? String(item.department_id) : undefined,
    severity: item.severity || "medium",
    status: st,
    location: {
      address: item.location?.address || item.address || "Reported Location",
      locality: item.location?.locality || item.locality || item.address || "Local District",
      latitude: item.location?.coordinates ? item.location.coordinates[1] : (item.latitude || 37.7749),
      longitude: item.location?.coordinates ? item.location.coordinates[0] : (item.longitude || -122.4194),
    },
    reporter: {
      id: item.reporter?.id ? String(item.reporter.id) : "anon",
      name: item.reporter?.display_name || item.reporter?.name || "Anonymous Citizen",
      isAnonymous: Boolean(item.is_anonymous || item.reporter?.is_anonymous),
    },
    aiSummary: item.ai_summary || "Reported issue recorded and routed for department action.",
    publicImportance: item.priority_score > 75 ? "Urgent" : item.priority_score > 50 ? "High" : item.priority_score > 25 ? "Medium" : "Low",
    supportCount: item.support_count || item.supportCount || 0,
    isSupportedByMe: Boolean(item.is_supported_by_current_user || item.isSupportedByMe),
    followCount: item.follow_count || item.followCount || 0,
    isFollowedByMe: Boolean(item.is_followed_by_current_user || item.isFollowedByMe),
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
    latestOfficialUpdate: latestUpdate,
    timeline,
    resolution,
  };
}

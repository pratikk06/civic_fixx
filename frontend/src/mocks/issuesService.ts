import { CivicIssue, IssueFilterParams, CreateIssuePayload, AIAnalysisResult, IssueCategory, IssueSeverity } from "@/types";
import { MOCK_CIVIC_ISSUES } from "./mockIssues";

// In-memory mock store
let issuesStore: CivicIssue[] = JSON.parse(JSON.stringify(MOCK_CIVIC_ISSUES));

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockIssuesService = {
  getIssues: async (params?: IssueFilterParams): Promise<CivicIssue[]> => {
    await delay(200);
    let filtered = [...issuesStore];

    // Category filter
    if (params?.category && params.category !== "All") {
      filtered = filtered.filter((issue) => {
        const cat = params.category?.toLowerCase() || "";
        const issueCat = issue.category.toLowerCase();
        if (cat === "roads") return issueCat.includes("road");
        if (cat === "garbage") return issueCat.includes("waste") || issueCat.includes("sanitation");
        if (cat === "water") return issueCat.includes("water") || issueCat.includes("drainage");
        if (cat === "electricity") return issueCat.includes("street") || issueCat.includes("electric");
        if (cat === "infrastructure") return issueCat.includes("infrastructure") || issueCat.includes("park");
        return issueCat.includes(cat);
      });
    }

    // Status filter
    if (params?.status) {
      filtered = filtered.filter((issue) => issue.status === params.status);
    }

    // Tab Sorting & Filtering
    if (params?.tab === "trending") {
      filtered.sort((a, b) => b.supportCount - a.supportCount);
    } else if (params?.tab === "nearby") {
      filtered.sort((a, b) => (a.location.locality.localeCompare(b.location.locality)));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  },

  getTrendingIssues: async (): Promise<CivicIssue[]> => {
    await delay(150);
    return [...issuesStore].sort((a, b) => b.supportCount - a.supportCount).slice(0, 4);
  },

  getIssueById: async (issueId: string): Promise<CivicIssue | undefined> => {
    await delay(150);
    return issuesStore.find((i) => i.id === issueId);
  },

  analyzeIssueDraft: async (draft: { title?: string; description?: string; imagePreview?: string }): Promise<AIAnalysisResult> => {
    await delay(1000); // Simulate Groq AI analysis latency

    const text = `${draft.title || ""} ${draft.description || ""}`.toLowerCase();
    
    let category: IssueCategory = "Road Infrastructure";
    let suggestedDepartment = "Roads & Public Works";
    let departmentId = "roads";
    let severity: IssueSeverity = "high";
    let summary = "AI Summary: Structural road defect identified. Presents potential traffic hazard and pedestrian safety risk.";

    if (text.includes("garbage") || text.includes("trash") || text.includes("waste") || text.includes("dump") || text.includes("clean")) {
      category = "Waste & Sanitation";
      suggestedDepartment = "Sanitation & Waste Management";
      departmentId = "waste";
      severity = "medium";
      summary = "AI Summary: Uncollected solid waste accumulation identified. Risk of public health nuisance and odor dispersal.";
    } else if (text.includes("light") || text.includes("dark") || text.includes("electric") || text.includes("wire") || text.includes("pole") || text.includes("transformer")) {
      category = "Street Lighting & Electrical";
      suggestedDepartment = "Electricity & Street Lighting";
      departmentId = "electrical";
      severity = text.includes("wire") || text.includes("spark") ? "critical" : "high";
      summary = "AI Summary: Public electrical infrastructure fault. Immediate risk of low nocturnal visibility and potential hazard.";
    } else if (text.includes("water") || text.includes("leak") || text.includes("pipe") || text.includes("flood") || text.includes("drain") || text.includes("sewage")) {
      category = "Water Supply & Drainage";
      suggestedDepartment = "Water Supply & Sewage";
      departmentId = "water";
      severity = text.includes("flood") || text.includes("burst") ? "critical" : "high";
      summary = "AI Summary: Hydraulic network failure detected. Escalated to prevent drinking water loss and street waterlogging.";
    } else if (text.includes("park") || text.includes("tree") || text.includes("bench") || text.includes("footpath") || text.includes("pavement")) {
      category = "Public Parks & Environment";
      suggestedDepartment = "Parks & Urban Greenery";
      departmentId = "parks";
      severity = "medium";
      summary = "AI Summary: Public amenity damage affecting pedestrian movement and neighborhood livability.";
    }

    return {
      category,
      severity,
      suggestedDepartment,
      departmentId,
      summary,
      confidenceScore: 0.94,
      keyHazards: ["Pedestrian safety", "Traffic slowdown", "Public infrastructure degradation"],
    };
  },

  createIssue: async (payload: CreateIssuePayload): Promise<CivicIssue> => {
    await delay(300);
    const newId = `issue-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const imageUrl =
      typeof payload.image === "string"
        ? payload.image
        : payload.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80";

    const newIssue: CivicIssue = {
      id: newId,
      title: payload.title,
      description: payload.description || "",
      imageUrl,
      category: payload.category,
      department: payload.department || "Roads & Public Works",
      departmentId: "roads",
      severity: payload.severity,
      status: "reported",
      location: payload.location,
      reporter: {
        id: payload.isAnonymous ? "anon-" + newId : "usr-current-01",
        name: payload.isAnonymous ? "Anonymous Citizen" : "Rinku Diwakar",
        badge: payload.isAnonymous ? "Protected Identity" : "Civic Contributor",
        avatarUrl: payload.isAnonymous ? undefined : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        isAnonymous: payload.isAnonymous,
      },
      aiSummary: payload.aiSummary || `AI Summary: Verified citizen report of ${payload.category.toLowerCase()} at ${payload.location.locality}.`,
      publicImportance: payload.severity === "critical" || payload.severity === "high" ? "High" : "Medium",
      supportCount: 1,
      isSupportedByMe: true,
      followCount: 1,
      isFollowedByMe: true,
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        {
          id: `tl-${newId}-1`,
          title: payload.isAnonymous ? "Anonymous Citizen Report Submitted" : "Citizen Report Submitted",
          description: "Evidence uploaded and GPS coordinates registered.",
          timestamp: nowIso,
          type: "reported",
          actorName: payload.isAnonymous ? "Anonymous Citizen" : "Rinku Diwakar",
        },
        {
          id: `tl-${newId}-2`,
          title: "AI Triage & Categorization Complete",
          description: `Classified as ${payload.category} • ${payload.severity.toUpperCase()} Severity • Routed to ${payload.department || "Municipal Desk"}.`,
          timestamp: nowIso,
          type: "ai_analyzed",
        },
      ],
    };

    // Prepend to top of issues
    issuesStore = [newIssue, ...issuesStore];
    return newIssue;
  },

  toggleSupport: async (issueId: string): Promise<{ issueId: string; supportCount: number; isSupported: boolean }> => {
    await delay(100);
    const index = issuesStore.findIndex((i) => i.id === issueId);
    if (index === -1) {
      throw new Error("Issue not found");
    }

    const current = issuesStore[index];
    const newIsSupported = !current.isSupportedByMe;
    const newSupportCount = newIsSupported
      ? current.supportCount + 1
      : Math.max(0, current.supportCount - 1);

    issuesStore[index] = {
      ...current,
      isSupportedByMe: newIsSupported,
      supportCount: newSupportCount,
    };

    return {
      issueId,
      supportCount: newSupportCount,
      isSupported: newIsSupported,
    };
  },

  toggleFollow: async (issueId: string): Promise<{ issueId: string; followCount: number; isFollowed: boolean }> => {
    await delay(100);
    const index = issuesStore.findIndex((i) => i.id === issueId);
    if (index === -1) {
      throw new Error("Issue not found");
    }

    const current = issuesStore[index];
    const newIsFollowed = !current.isFollowedByMe;
    const newFollowCount = newIsFollowed
      ? current.followCount + 1
      : Math.max(0, current.followCount - 1);

    issuesStore[index] = {
      ...current,
      isFollowedByMe: newIsFollowed,
      followCount: newFollowCount,
    };

    return {
      issueId,
      followCount: newFollowCount,
      isFollowed: newIsFollowed,
    };
  },
};

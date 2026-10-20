import { apiClient } from "./client";
import { adaptBackendIssueToFrontend, CATEGORY_MAP, REVERSE_CATEGORY_MAP } from "./adapters";
import { uploadsApi } from "./uploads";
import {
  CivicIssue,
  CreateIssuePayload,
  IssueFilterParams,
  AIAnalysisResult,
} from "@/types";

export const issuesApi = {
  // Get public feed of issues
  getIssues: async (params?: IssueFilterParams): Promise<CivicIssue[]> => {
    let endpoint = "/issues";
    if (params?.tab === "trending") {
      endpoint = "/issues/trending";
    } else if (params?.tab === "nearby" && params?.lat && params?.lng) {
      endpoint = "/issues/nearby";
    }

    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params?.category && params.category !== "All") {
      queryParams.category = REVERSE_CATEGORY_MAP[params.category] || params.category;
    }
    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.lat && params?.lng) {
      queryParams.latitude = params.lat;
      queryParams.longitude = params.lng;
      queryParams.radius_km = params.radiusKm || 5;
    }

    const res = await apiClient.get<any>(endpoint, { params: queryParams });
    const rawItems = Array.isArray(res) ? res : (res?.items || res?.data || []);
    return rawItems.map(adaptBackendIssueToFrontend);
  },

  // Get trending issues
  getTrendingIssues: async (): Promise<CivicIssue[]> => {
    const res = await apiClient.get<any>("/issues/trending");
    const rawItems = Array.isArray(res) ? res : (res?.items || res?.data || []);
    return rawItems.map(adaptBackendIssueToFrontend);
  },

  // Get nearby issues based on coordinates and radius
  getNearbyIssues: async (lat: number, lng: number, radiusKm: number = 5): Promise<CivicIssue[]> => {
    const res = await apiClient.get<any>("/issues/nearby", {
      params: { latitude: lat, longitude: lng, radius_km: radiusKm },
    });
    const rawItems = Array.isArray(res) ? res : (res?.items || res?.data || []);
    return rawItems.map(adaptBackendIssueToFrontend);
  },

  // Get a single issue by ID
  getIssueById: async (issueId: string): Promise<CivicIssue> => {
    const res = await apiClient.get<any>(`/issues/${issueId}`);
    return adaptBackendIssueToFrontend("data" in res ? res.data : res);
  },

  // Create a new civic issue
  createIssue: async (payload: CreateIssuePayload): Promise<CivicIssue> => {
    let imagePath = payload.imageUrl || (typeof payload.image === "string" ? payload.image : "");

    if (payload.image instanceof File) {
      try {
        const uploadRes = await uploadsApi.uploadIssueImage(payload.image);
        if (uploadRes.storage_path && !payload.imageUrl) {
          imagePath = uploadRes.storage_path;
        }
      } catch {
        // If upload fails, use the data URL preview
        if (payload.imageUrl) {
          imagePath = payload.imageUrl;
        }
      }
    }

    if (!imagePath) {
      imagePath = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop";
    }

    const backendPayload = {
      title: payload.title,
      user_description: payload.description,
      before_image_path: imagePath,
      latitude: payload.location?.latitude || 28.5034,
      longitude: payload.location?.longitude || 77.0673,
      address: payload.location?.locality || payload.location?.address || "Reported Location",
      category: REVERSE_CATEGORY_MAP[payload.category] || "other",
      severity: payload.severity || "medium",
      is_anonymous: payload.isAnonymous || false,
    };

    const res = await apiClient.post<any>("/issues", backendPayload);
    return adaptBackendIssueToFrontend("data" in res ? res.data : res);
  },

  // Support / Vote for an issue
  supportIssue: async (issueId: string): Promise<{ supportCount: number; isSupported: boolean }> => {
    const res = await apiClient.post<any>(`/issues/${issueId}/support`);
    return {
      supportCount: res.support_count ?? res.supportCount ?? 1,
      isSupported: res.is_supported ?? res.isSupported ?? true,
    };
  },

  // Remove support from an issue
  unsupportIssue: async (issueId: string): Promise<{ supportCount: number; isSupported: boolean }> => {
    const res = await apiClient.delete<any>(`/issues/${issueId}/support`);
    return {
      supportCount: res.support_count ?? res.supportCount ?? 0,
      isSupported: res.is_supported ?? res.isSupported ?? false,
    };
  },

  // Follow an issue
  followIssue: async (issueId: string): Promise<{ followCount: number; isFollowed: boolean }> => {
    const res = await apiClient.post<any>(`/issues/${issueId}/follow`);
    return {
      followCount: res.follow_count ?? res.followCount ?? 1,
      isFollowed: res.is_followed ?? res.isFollowed ?? true,
    };
  },

  // Unfollow an issue
  unfollowIssue: async (issueId: string): Promise<{ followCount: number; isFollowed: boolean }> => {
    const res = await apiClient.delete<any>(`/issues/${issueId}/follow`);
    return {
      followCount: res.follow_count ?? res.followCount ?? 0,
      isFollowed: res.is_followed ?? res.isFollowed ?? false,
    };
  },

  // Request backend Groq AI to analyze issue draft photo + description
  analyzeIssueDraft: async (imageData: { imageBase64?: string; imageUrl?: string; imagePath?: string; notes?: string }): Promise<AIAnalysisResult> => {
    const res = await apiClient.post<any>("/ai/analyze-issue", {
      image_path: imageData.imagePath || imageData.imageUrl || "issues/2026/08/draft.jpg",
      user_description: imageData.notes,
    });

    return {
      category: (res.category ? CATEGORY_MAP[res.category] : "Road Infrastructure") as any,
      severity: res.severity || "medium",
      suggestedDepartment: res.suggested_department_name || "Roads & Public Works",
      departmentId: res.suggested_department_id,
      summary: res.summary || "Visual analysis complete.",
      confidenceScore: res.confidence || 0.85,
    };
  },
};

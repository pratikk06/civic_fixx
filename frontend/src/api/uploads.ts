import { apiClient } from "./client";

export interface UploadResponse {
  url: string;
  thumbnailUrl?: string;
  path?: string;
  storage_path?: string;
}

export const uploadsApi = {
  // Upload issue evidence image to backend / Supabase Storage
  uploadIssueImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.request<any>("/uploads/issue-image", {
      method: "POST",
      body: formData,
      headers: {},
    });

    const data = "data" in res ? res.data : res;
    const storagePath = data.storage_path || "issues/2026/08/uploaded.jpg";
    return {
      url: storagePath,
      path: storagePath,
      storage_path: storagePath,
    };
  },
};

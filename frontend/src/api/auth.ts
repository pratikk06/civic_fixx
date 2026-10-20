import { apiClient } from "./client";
import { User } from "@/types";

export const authApi = {
  // Get current logged-in user profile
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const res = await apiClient.get<any>("/auth/me");
      const data = "data" in res ? res.data : res;
      return {
        id: String(data.id),
        name: data.display_name || data.name || "Citizen Reporter",
        email: "user@civicfix.org",
        role: data.role || "citizen",
        createdAt: data.created_at || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  // Citizen or authority login
  login: async (credentials: { email: string; password?: string; role?: "citizen" | "authority" }): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post<any>("/auth/login", credentials);
    if (res.token) {
      localStorage.setItem("civicfix_auth_token", res.token);
    }
    return res;
  },

  // Citizen registration
  register: async (data: { name: string; email: string; password?: string }): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post<any>("/auth/register", data);
    if (res.token) {
      localStorage.setItem("civicfix_auth_token", res.token);
    }
    return res;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("civicfix_auth_token");
    }
  },
};

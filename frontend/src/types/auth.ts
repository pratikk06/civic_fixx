export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "citizen" | "authority" | "admin";
  departmentId?: string;
  departmentName?: string;
  civicBadge?: string;
  stats?: {
    reportedCount: number;
    supportedCount: number;
    followingCount: number;
  };
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  token?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

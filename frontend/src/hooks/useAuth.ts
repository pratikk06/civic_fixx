import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { authApi } from "@/api/auth";

export const AUTH_QUERY_KEY = ["auth", "user"];

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      return authApi.getCurrentUser();
    },
    staleTime: 1000 * 60 * 10,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password?: string; role?: "citizen" | "authority" }) => {
      return authApi.login(credentials);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, res.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password?: string }) => {
      return authApi.register(data);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, res.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return authApi.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.invalidateQueries();
    },
  });

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}

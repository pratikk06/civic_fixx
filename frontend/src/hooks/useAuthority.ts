import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthorityDashboardStats, OfficialUpdatePayload, ResolutionPayload, AuthorityIssueItem } from "@/types";
import { authorityApi } from "@/api/authority";

export const AUTHORITY_QUEUE_KEY = ["authority", "queue"];

export function useAuthorityWorkQueue(departmentId?: string) {
  return useQuery<{ items: AuthorityIssueItem[]; stats: AuthorityDashboardStats }>({
    queryKey: [...AUTHORITY_QUEUE_KEY, departmentId],
    queryFn: async () => {
      return authorityApi.getWorkQueue(departmentId);
    },
  });
}

export function useUpdateIssueStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueId, status }: { issueId: string; status: string }) => {
      return authorityApi.updateStatus(issueId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTHORITY_QUEUE_KEY });
    },
  });
}

export function usePostOfficialUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OfficialUpdatePayload) => {
      return authorityApi.postOfficialUpdate(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTHORITY_QUEUE_KEY });
    },
  });
}

export function useSubmitResolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ResolutionPayload) => {
      return authorityApi.submitResolution(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTHORITY_QUEUE_KEY });
    },
  });
}

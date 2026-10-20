import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CivicIssue, IssueFilterParams, CreateIssuePayload, AIAnalysisResult } from "@/types";
import { mockIssuesService } from "@/mocks/issuesService";
import { issuesApi } from "@/api/issues";
import { APP_CONFIG } from "@/lib/constants";

export const ISSUES_QUERY_KEY = ["issues"];
export const TRENDING_QUERY_KEY = ["issues", "trending"];

export function useIssues(params?: IssueFilterParams) {
  return useQuery<CivicIssue[]>({
    queryKey: [...ISSUES_QUERY_KEY, params],
    queryFn: async () => {
      if (APP_CONFIG.useMockData) {
        return mockIssuesService.getIssues(params);
      }
      return issuesApi.getIssues(params);
    },
  });
}

export function useTrendingIssues() {
  return useQuery<CivicIssue[]>({
    queryKey: TRENDING_QUERY_KEY,
    queryFn: async () => {
      if (APP_CONFIG.useMockData) {
        return mockIssuesService.getTrendingIssues();
      }
      return issuesApi.getTrendingIssues();
    },
  });
}

export function useIssueDetail(issueId: string) {
  return useQuery<CivicIssue | undefined>({
    queryKey: ["issue", issueId],
    queryFn: async () => {
      if (APP_CONFIG.useMockData) {
        return mockIssuesService.getIssueById(issueId);
      }
      return issuesApi.getIssueById(issueId);
    },
    enabled: Boolean(issueId),
  });
}

export function useAnalyzeIssue() {
  return useMutation<AIAnalysisResult, Error, { title?: string; description?: string; imagePreview?: string }>({
    mutationFn: async (draft) => {
      if (APP_CONFIG.useMockData) {
        return mockIssuesService.analyzeIssueDraft(draft);
      }
      return issuesApi.analyzeIssueDraft({ notes: draft.description });
    },
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation<CivicIssue, Error, CreateIssuePayload>({
    mutationFn: async (payload) => {
      if (APP_CONFIG.useMockData) {
        return mockIssuesService.createIssue(payload);
      }
      return issuesApi.createIssue(payload);
    },
    onSuccess: (newIssue) => {
      // Invalidate issues cache so the feed immediately updates
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEY });
      queryClient.setQueryData(["issue", newIssue.id], newIssue);
    },
  });
}

export function useSupportIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      if (APP_CONFIG.useMockData) {
        return mockIssuesService.toggleSupport(issueId);
      }
      return issuesApi.supportIssue(issueId);
    },
    onMutate: async (issueId: string) => {
      await queryClient.cancelQueries({ queryKey: ISSUES_QUERY_KEY });

      queryClient.setQueriesData({ queryKey: ISSUES_QUERY_KEY }, (oldData: unknown) => {
        if (!Array.isArray(oldData)) return oldData;
        return oldData.map((issue: CivicIssue) => {
          if (issue.id === issueId) {
            const nextSupported = !issue.isSupportedByMe;
            return {
              ...issue,
              isSupportedByMe: nextSupported,
              supportCount: nextSupported ? issue.supportCount + 1 : Math.max(0, issue.supportCount - 1),
            };
          }
          return issue;
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRENDING_QUERY_KEY });
    },
  });
}

export function useFollowIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      if (APP_CONFIG.useMockData) {
        return mockIssuesService.toggleFollow(issueId);
      }
      return issuesApi.followIssue(issueId);
    },
    onMutate: async (issueId: string) => {
      await queryClient.cancelQueries({ queryKey: ISSUES_QUERY_KEY });

      queryClient.setQueriesData({ queryKey: ISSUES_QUERY_KEY }, (oldData: unknown) => {
        if (!Array.isArray(oldData)) return oldData;
        return oldData.map((issue: CivicIssue) => {
          if (issue.id === issueId) {
            const nextFollowed = !issue.isFollowedByMe;
            return {
              ...issue,
              isFollowedByMe: nextFollowed,
              followCount: nextFollowed ? issue.followCount + 1 : Math.max(0, issue.followCount - 1),
            };
          }
          return issue;
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEY });
    },
  });
}

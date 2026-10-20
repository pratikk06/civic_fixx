import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  HomePage,
  TrendingPage,
  NearbyPage,
  CreateIssuePage,
  IssueDetailPage,
  ProfilePage,
  AuthorityDashboardPage,
  LoginPage,
  NotFoundPage,
} from "@/pages";

// Initialize QueryClient with standard defaults for resilient offline/mock fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Main Application Layout Shell */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/nearby" element={<NearbyPage />} />
            <Route path="/report" element={<CreateIssuePage />} />
            <Route path="/issues/:issueId" element={<IssueDetailPage />} />
            <Route path="/following" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/authority" element={<AuthorityDashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* 404 Route */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

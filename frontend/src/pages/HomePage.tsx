import React, { useState } from "react";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FeedTabs, FeedTabType } from "@/components/feed/FeedTabs";
import { IssueFilters } from "@/components/feed/IssueFilters";
import { IssueCard } from "@/components/issues/IssueCard";
import { LoadingSkeletonList } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useIssues, useSupportIssue, useFollowIssue } from "@/hooks/useIssues";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FeedTabType>("latest");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch issues with active filters
  const { data: issues, isLoading, isError } = useIssues({
    tab: activeTab,
    category: selectedCategory,
  });

  const supportMutation = useSupportIssue();
  const followMutation = useFollowIssue();

  const handleSupportToggle = (issueId: string) => {
    supportMutation.mutate(issueId);
  };

  const handleFollowToggle = (issueId: string) => {
    followMutation.mutate(issueId);
  };

  // Optional client search filter
  const displayedIssues = issues?.filter((issue) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(q) ||
      issue.location.locality.toLowerCase().includes(q) ||
      issue.department.toLowerCase().includes(q) ||
      issue.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Top Header & Page Identity */}
      <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
            Civic Issues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            See what's happening. Support what matters.
          </p>
        </div>

        <Button
          variant="civic"
          size="sm"
          className="hidden sm:inline-flex shadow-xs font-bold"
          leftIcon={<PlusCircle className="h-4 w-4" />}
          onClick={() => navigate("/report")}
        >
          Report an Issue
        </Button>
      </div>

      {/* Feed Controls: Primary Tabs & Category Filters */}
      <div className="space-y-3">
        {/* Main Tabs (Latest | Trending | Near You) */}
        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center text-xs font-bold text-slate-400 gap-1 pl-1">
            <Filter className="h-3 w-3 text-slate-400" />
            <span>Category:</span>
          </div>
          <IssueFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            className="flex-1"
          />
        </div>
      </div>

      {/* Search Input for Mobile/Tablet */}
      <div className="relative md:hidden">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search reports by location or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
        />
      </div>

      {/* Main Issue Cards Feed Stream */}
      <div className="space-y-4 pt-1">
        {isLoading ? (
          <LoadingSkeletonList count={3} />
        ) : isError ? (
          <EmptyState
            title="Failed to Load Feed"
            description="Could not load the latest civic issue feed. Please verify your connection."
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        ) : displayedIssues && displayedIssues.length > 0 ? (
          displayedIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onSupportToggle={handleSupportToggle}
              onFollowToggle={handleFollowToggle}
            />
          ))
        ) : (
          <EmptyState
            title={`No ${selectedCategory !== "All" ? selectedCategory : ""} Issues Found`}
            description={
              searchQuery
                ? `No reported civic issues match "${searchQuery}".`
                : `No civic issues have been reported in this category yet.`
            }
            actionLabel="Reset All Filters"
            onAction={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setActiveTab("latest");
            }}
          />
        )}
      </div>
    </div>
  );
};

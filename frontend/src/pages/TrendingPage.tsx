import React, { useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { useTrendingIssues } from "@/hooks/useIssues";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export const TrendingPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month">("week");
  const { data: issues, isLoading } = useTrendingIssues();

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Heading */}
      <div className="flex flex-col gap-1 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-xs">
            <Flame className="h-5 w-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Trending Civic Issues
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Issues receiving strong community attention and priority department escalation.
        </p>
      </div>

      {/* Timeframe Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setTimeframe("today")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            timeframe === "today"
              ? "bg-amber-500 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setTimeframe("week")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            timeframe === "week"
              ? "bg-amber-500 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          This Week
        </button>
        <button
          type="button"
          onClick={() => setTimeframe("month")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            timeframe === "month"
              ? "bg-amber-500 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          This Month
        </button>
      </div>

      {/* Ranked Trending Feed */}
      {isLoading ? (
        <div className="space-y-4">
          <IssueCardSkeleton />
          <IssueCardSkeleton />
        </div>
      ) : !issues || issues.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
          <Trophy className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Trending Issues Yet</h3>
          <p className="text-xs text-slate-500">Be the first to report and mobilize community support.</p>
          <Button size="sm" onClick={() => navigate("/report")}>
            Report an Issue
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue, idx) => (
            <div key={issue.id} className="relative">
              {/* Rank Badge */}
              <div className="absolute -left-3 -top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-extrabold shadow-md border-2 border-white">
                #{idx + 1}
              </div>
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

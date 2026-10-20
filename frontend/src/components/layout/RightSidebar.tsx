import React from "react";
import { Link } from "react-router-dom";
import { Flame, CheckCircle2, TrendingUp, MapPin, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTrendingIssues } from "@/hooks/useIssues";
import { TrendingIssueItem } from "@/components/feed/TrendingIssueItem";
import { Skeleton } from "@/components/ui/Skeleton";

export const RightSidebar: React.FC = () => {
  const { data: trendingIssues, isLoading } = useTrendingIssues();

  return (
    <aside className="sticky top-16 hidden lg:flex flex-col space-y-5 w-80 p-4 pl-0 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
      {/* Platform Civic Impact Stats */}
      <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 shadow-xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Civic Resolution Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-white p-3 border border-emerald-100 shadow-xs">
            <div className="text-2xl font-black text-slate-900 font-sans tracking-tight">42</div>
            <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Issues reported today</div>
          </div>
          <div className="rounded-xl bg-white p-3 border border-emerald-100 shadow-xs">
            <div className="text-2xl font-black text-emerald-600 font-sans tracking-tight">18</div>
            <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Resolved this week</div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Civic Issues Widget */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-500" />
            Trending Civic Issues
          </CardTitle>
          <Link
            to="/trending"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </CardHeader>

        <CardContent className="p-4 pt-3 divide-y divide-slate-100">
          {isLoading ? (
            <div className="space-y-3 py-1">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : trendingIssues && trendingIssues.length > 0 ? (
            trendingIssues.slice(0, 4).map((item, index) => (
              <TrendingIssueItem key={item.id} issue={item} rank={index + 1} />
            ))
          ) : (
            <div className="text-xs text-slate-400 py-3 text-center">No trending issues yet.</div>
          )}
        </CardContent>
      </Card>

      {/* Active Issues Near You Widget */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
          <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            Active Near Gurgaon
          </CardTitle>
          <Link
            to="/nearby"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Nearby
          </Link>
        </CardHeader>
        <CardContent className="p-4 pt-3 text-xs space-y-2.5">
          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="font-semibold text-slate-700">Sector 21 & 23</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
              4 Active
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="font-semibold text-slate-700">Sector 14 & 15</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
              6 Active
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-slate-700">Sector 45 & 56</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
              8 Active
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Public Accountability Notice */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
          Transparent Civic Action
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Issues receiving high citizen support are flagged with elevated department response priority and public escalation timers.
        </p>
      </div>
    </aside>
  );
};

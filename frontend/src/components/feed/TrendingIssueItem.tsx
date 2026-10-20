import React from "react";
import { Link } from "react-router-dom";
import { Users, ArrowUpRight } from "lucide-react";
import { CivicIssue } from "@/types";

interface TrendingIssueItemProps {
  issue: CivicIssue;
  rank: number;
}

export const TrendingIssueItem: React.FC<TrendingIssueItemProps> = ({ issue, rank }) => {
  return (
    <Link
      to={`/issues/${issue.id}`}
      className="group block py-3 first:pt-0 last:pb-0 transition-all hover:translate-x-0.5"
    >
      <div className="flex items-start gap-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-50 text-amber-800 text-xs font-black font-mono mt-0.5 border border-amber-200/80">
          #{rank}
        </span>
        <div className="flex-1 space-y-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
            {issue.title}
          </h4>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <Users className="h-3 w-3 text-emerald-600" />
              {issue.supportCount.toLocaleString()} supporters
            </span>
            <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
              {issue.location.locality.split(",")[0]}
            </span>
          </div>
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-0.5" />
      </div>
    </Link>
  );
};

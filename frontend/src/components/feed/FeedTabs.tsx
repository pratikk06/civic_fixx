import React from "react";
import { Sparkles, Flame, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedTabType = "latest" | "trending" | "nearby";

interface FeedTabsProps {
  activeTab: FeedTabType;
  onTabChange: (tab: FeedTabType) => void;
}

export const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "latest" as const, label: "Latest", icon: Sparkles },
    { id: "trending" as const, label: "Trending", icon: Flame },
    { id: "nearby" as const, label: "Near You", icon: MapPin },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 border border-slate-200/80">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150 select-none",
              isActive
                ? "bg-white text-emerald-800 shadow-sm shadow-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            )}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5",
                isActive
                  ? tab.id === "trending"
                    ? "text-amber-500"
                    : "text-emerald-600"
                  : "text-slate-400"
              )}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

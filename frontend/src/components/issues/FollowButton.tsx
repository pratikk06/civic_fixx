import React from "react";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  isFollowed: boolean;
  followCount?: number;
  onToggle: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowed,
  onToggle,
  isLoading = false,
  className,
  size = "default",
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      aria-label={isFollowed ? "Unfollow issue updates" : "Follow issue for official updates"}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-all duration-150 active:scale-95 border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3.5 text-xs sm:text-sm",
        isFollowed
          ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300",
        className
      )}
    >
      {isFollowed ? (
        <>
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Following</span>
        </>
      ) : (
        <>
          <Bell className="h-3.5 w-3.5 text-slate-500" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

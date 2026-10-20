import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportButtonProps {
  supportCount: number;
  isSupported: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export const SupportButton: React.FC<SupportButtonProps> = ({
  supportCount,
  isSupported,
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
      aria-label={isSupported ? "Withdraw support for this issue" : "Support this civic issue"}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 active:scale-95 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-xs sm:text-sm",
        isSupported
          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700 border border-emerald-600"
          : "bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 hover:bg-emerald-100/90 hover:border-emerald-300",
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        {isSupported ? (
          <Check className="h-4 w-4 stroke-[3] text-white" />
        ) : (
          <span className="text-sm sm:text-base leading-none">✊</span>
        )}
        <span className="font-semibold tracking-tight">
          {isSupported ? "Supporting" : "Support"}
        </span>
      </span>

      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
          isSupported
            ? "bg-emerald-700/60 text-emerald-100"
            : "bg-emerald-100/90 text-emerald-900 group-hover:bg-emerald-200/80"
        )}
      >
        {supportCount.toLocaleString()}
      </span>
    </button>
  );
};

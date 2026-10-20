import React from "react";
import { IssueStatus } from "@/types";
import { AlertCircle, Clock, Wrench, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueStatusBadgeProps {
  status: IssueStatus;
  className?: string;
  size?: "sm" | "default";
}

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({
  status,
  className,
  size = "default",
}) => {
  const configs = {
    reported: {
      label: "Reported",
      icon: AlertCircle,
      classes: "bg-red-50 text-red-700 border-red-200/90 shadow-red-500/10",
      dot: "bg-red-500 animate-pulse",
    },
    acknowledged: {
      label: "Authority Acknowledged",
      icon: Clock,
      classes: "bg-amber-50 text-amber-800 border-amber-200/90 shadow-amber-500/10",
      dot: "bg-amber-500",
    },
    action_underway: {
      label: "Action Underway",
      icon: Wrench,
      classes: "bg-orange-50 text-orange-800 border-orange-200/90 shadow-orange-500/10",
      dot: "bg-orange-500",
    },
    resolved: {
      label: "Resolved",
      icon: CheckCircle2,
      classes: "bg-emerald-50 text-emerald-800 border-emerald-200/90 shadow-emerald-500/10",
      dot: "bg-emerald-600",
    },
  };

  const config = configs[status] || configs.reported;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight transition-colors shadow-xs select-none",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        config.classes,
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full flex-shrink-0", config.dot)} />
      <Icon className={cn("flex-shrink-0", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      <span>{config.label}</span>
    </div>
  );
};

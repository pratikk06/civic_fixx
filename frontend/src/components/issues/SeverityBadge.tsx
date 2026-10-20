import React from "react";
import { IssueSeverity } from "@/types";
import { AlertTriangle, AlertOctagon, ShieldAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: IssueSeverity;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className }) => {
  const configs = {
    low: {
      label: "LOW",
      icon: Info,
      classes: "bg-slate-100 text-slate-700 border-slate-200",
    },
    medium: {
      label: "MEDIUM",
      icon: AlertTriangle,
      classes: "bg-blue-50 text-blue-700 border-blue-200",
    },
    high: {
      label: "HIGH",
      icon: ShieldAlert,
      classes: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
    },
    critical: {
      label: "CRITICAL",
      icon: AlertOctagon,
      classes: "bg-red-50 text-red-800 border-red-300 font-black",
    },
  };

  const config = configs[severity] || configs.medium;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border",
        config.classes,
        className
      )}
    >
      <Icon className="h-3 w-3 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

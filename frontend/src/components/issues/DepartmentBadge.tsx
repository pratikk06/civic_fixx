import React from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepartmentBadgeProps {
  department: string;
  className?: string;
}

export const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({ department, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200/90",
        className
      )}
    >
      <Building2 className="h-3 w-3 text-slate-500 flex-shrink-0" />
      <span className="truncate max-w-[180px] sm:max-w-none">{department}</span>
    </span>
  );
};

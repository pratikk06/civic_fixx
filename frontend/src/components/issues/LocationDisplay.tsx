import React from "react";
import { MapPin } from "lucide-react";
import { IssueLocation } from "@/types";
import { cn } from "@/lib/utils";

interface LocationDisplayProps {
  location: IssueLocation;
  timeAgo?: string;
  className?: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  timeAgo,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-slate-500", className)}>
      {timeAgo && (
        <>
          <span className="font-medium text-slate-600">{timeAgo}</span>
          <span className="text-slate-300">·</span>
        </>
      )}
      <span className="inline-flex items-center gap-1 text-slate-600 font-medium truncate">
        <MapPin className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
        <span className="truncate">{location.locality || location.address}</span>
      </span>
    </div>
  );
};

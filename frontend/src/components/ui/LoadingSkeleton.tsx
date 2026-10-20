import React from "react";
import { Skeleton } from "./Skeleton";
import { Card, CardContent } from "./Card";

export const IssueCardSkeleton: React.FC = () => {
  return (
    <Card className="border-slate-200/80 shadow-card overflow-hidden">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Reporter Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>

        {/* Image Skeleton */}
        <Skeleton className="h-60 sm:h-72 w-full rounded-xl" />

        {/* AI Summary Card Skeleton */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-full" />
        </div>

        {/* Badges Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-md" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
};

export const LoadingSkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <IssueCardSkeleton key={index} />
      ))}
    </div>
  );
};

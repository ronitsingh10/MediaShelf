"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const FeedCardSkeleton = () => {
  return (
    <div className="p-6 border-t border-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="flex-shrink-0 w-28 h-40 rounded-xl" />

        <div className="flex flex-col w-full">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />

          <Skeleton className="h-16 w-full mb-4" />

          <div className="mt-auto">
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeedSkeletonList = () => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-50">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <FeedCardSkeleton key={index} />
        ))}
    </div>
  );
};

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-10 w-28 mt-4 md:mt-0" />
            </div>
            <Skeleton className="h-16 w-full mt-4" />
            <Skeleton className="h-4 w-40 mt-2" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex flex-col space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-24 w-full rounded-md" />
                  </div>
                ))}
            </div>

            <div className="mt-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-md" />
                  ))}
              </div>
            </div>

            <div className="mt-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-md" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

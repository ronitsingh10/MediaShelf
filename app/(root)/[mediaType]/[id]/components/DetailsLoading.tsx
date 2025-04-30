import { Skeleton } from "@/components/ui/skeleton";

const MovieDetailsLoading = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-12">
      {/* Backdrop skeleton */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="container mx-auto px-4 -mt-72 pb-12 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start relative">
          {/* Movie poster skeleton */}
          <div className="relative z-10">
            <Skeleton className="w-[300px] h-[450px] rounded-lg" />
          </div>

          {/* Movie details skeleton */}
          <div>
            <Skeleton className="h-12 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />

            <Skeleton className="h-10 w-40 mb-6" />

            {/* Synopsis skeleton */}
            <Skeleton className="h-24 w-full mb-6 rounded-lg" />

            <div className="flex flex-wrap gap-4 mb-8">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-24" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-48" />
              </div>

              {/* Rating bars skeleton */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-2 items-center mb-1"
                >
                  <div className="text-right">
                    <Skeleton className="h-4 w-8 ml-auto" />
                  </div>
                  <div className="col-span-4">
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsLoading;

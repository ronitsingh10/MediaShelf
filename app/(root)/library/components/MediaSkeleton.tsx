const MediaSkeleton = () => {
  return (
    <div className="overflow-hidden group">
      <div className="aspect-[2/3] relative overflow-hidden rounded-md">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
      <div className="p-2 tracking-tight text-center">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse" />
      </div>
    </div>
  );
};

export default MediaSkeleton;

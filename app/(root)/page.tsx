"use client";

import { useState, useEffect } from "react";
import { getFeed } from "@/server/actions/feed-actions";
import FeedCard from "@/components/feed-card";
import { FeedSkeletonList } from "@/components/feed-skeleton";

const Home = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    const result = await getFeed(page);

    if (result.success) {
      if (result.data.length === 0) {
        setHasMore(false);
      } else {
        setFeed((prev) =>
          page === 1 ? result.data : [...prev, ...result.data]
        );
        setPage((prev) => prev + 1);
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Feed</h1>

      {loading && feed.length === 0 ? (
        <FeedSkeletonList />
      ) : feed.length === 0 && !loading ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">Your feed is empty</p>
          <p className="text-gray-500">
            Follow users to see their activity in your feed
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200 dark:divide-gray-50">
            {feed.map((activity) => (
              <FeedCard
                key={`${activity.userId}-${activity.mediaId}-${activity.timestamp}`}
                user={{
                  userName: activity.userName,
                  name: activity.Name,
                  avatar: activity.userImage || "/placeholder-avatar.png",
                  timeAgo: new Date(activity.timestamp).toLocaleString(),
                }}
                media={{
                  id: activity.mediaId,
                  title: activity.mediaTitle,
                  creator: activity.mediaAuthor,
                  cover: activity.mediaCover,
                  mediaType: activity.mediaType,
                  statusCode: parseInt(activity.status),
                  progress: activity.progress,
                  rating: activity.rating,
                  review: activity.review,
                }}
              />
            ))}
          </div>

          {hasMore && (
            <button
              onClick={loadFeed}
              disabled={loading}
              className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

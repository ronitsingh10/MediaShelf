"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListFilter } from "lucide-react";
import FeedCard from "@/components/feed-card";

const ActivityFeed = ({ activities }) => {
  const [showAllActivities, setShowAllActivities] = useState(false);
  const visibleActivities = activities.slice(0, 5); // Show only 5 activities initially

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Recent Activity</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllActivities(true)}
          className="flex items-center gap-1"
        >
          <ListFilter className="h-4 w-4" />
          <span>View All</span>
        </Button>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-50">
        {visibleActivities.map((activity) => (
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
              statusCode: Number.parseInt(activity.status),
              progress: activity.progress,
              rating: activity.rating,
            }}
          />
        ))}
      </div>

      <Dialog open={showAllActivities} onOpenChange={setShowAllActivities}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Activity</DialogTitle>
          </DialogHeader>
          <div className="divide-y divide-gray-200 dark:divide-gray-50">
            {activities.map((activity) => (
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
                  statusCode: Number.parseInt(activity.status),
                  progress: activity.progress,
                  rating: activity.rating,
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityFeed;

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Film,
  Heart,
  Info,
  Star,
  Tv,
  GamepadIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getActivity } from "@/server/actions/feed-actions";

// Define the activity item type based on the API response
interface ActivityItem {
  userId: string;
  userName: string;
  userImage: string | null;
  Name: string;
  activityType: string;
  mediaId: string;
  mediaTitle: string;
  mediaType: string;
  mediaCover: string;
  mediaAuthor: string | null;
  timestamp: number;
  review?: string;
  rating?: number;
  progress?: string;
  status?: string;
}

// Update the UserActivityModalProps interface to include the userData prop:
interface UserActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  userImage: string | null;
  name: string;
  userData?: any; // This will contain the full user data including activity
}

// Then update the function signature to accept the new prop:
export default function UserActivityModal({
  isOpen,
  onClose,
  userName,
  userId,
  userImage,
  name,
  userData,
}: UserActivityModalProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedActivities, setLikedActivities] = useState<string[]>([]);

  useEffect(() => {
    // Only fetch data when the modal is open
    if (isOpen) {
      fetchUserActivities();
    }
    console.log("userdata", activities, userData);
  }, [isOpen, userId]);

  const fetchUserActivities = async () => {
    try {
      setLoading(true);

      // Check if we already have the user's activity data from the following page
      if (userData && userData.fullActivity) {
        setActivities(userData.fullActivity.data);
        return;
      }

      // If not, fetch it directly
      try {
        const activity = await getActivity(userId);
        if (activity) {
          setActivities(activity.data);
        } else {
          console.error("Failed to fetch user activities");
        }
      } catch (error) {
        console.error("Error fetching user activities:", error);
      }
    } catch (error) {
      console.error("Error in fetchUserActivities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (activityId: string, mediaId: string) => {
    const activityKey = `${activityId}-${mediaId}`;
    if (likedActivities.includes(activityKey)) {
      setLikedActivities(likedActivities.filter((id) => id !== activityKey));
    } else {
      setLikedActivities([...likedActivities, activityKey]);
    }
  };

  const getStatusText = (
    activityType: string,
    mediaType: string,
    status: string | undefined,
    progress: string | undefined,
    rating: number | undefined,
    review: string | undefined
  ): string => {
    switch (activityType) {
      case "watch":
        return `Watched a ${mediaType}`;
      case "read":
        return `Read a ${mediaType}`;
      case "game":
        return `Played a ${mediaType}`;
      case "review":
        if (rating) {
          return `Rated a ${mediaType}`;
        } else {
          return `Reviewed a ${mediaType}`;
        }
      case "progress":
        return `Made progress on a ${mediaType}`;
      case "status":
        return `Updated status on a ${mediaType} to ${status}`;
      default:
        return `Interacted with a ${mediaType}`;
    }
  };

  const getCreatorLabel = (mediaType: string): string => {
    switch (mediaType) {
      case "movies":
        return "Director:";
      case "books":
        return "Author:";
      case "tv":
        return "Director:";
      case "games":
        return "Developer:";
      default:
        return "Creator:";
    }
  };

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case "movies":
        return <Film className="h-4 w-4" />;
      case "books":
        return <BookOpen className="h-4 w-4" />;
      case "tv":
        return <Tv className="h-4 w-4" />;
      case "games":
        return <GamepadIcon className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const StarDisplay = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: rating }, (_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-background z-10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={userImage || "/placeholder.svg?height=100&width=100"}
                alt={name}
              />
              <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{name}'s Activity</DialogTitle>
              <p className="text-sm text-muted-foreground">@{userName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="px-6 pb-2">
          <p className="text-sm text-muted-foreground">All activity</p>
        </div>

        <div className="overflow-y-auto flex-1 pb-6">
          {loading ? (
            <div className="space-y-6 px-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-4 border-t">
                  <div className="flex gap-4">
                    <Skeleton className="h-40 w-28 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Film className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No activity to show
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {name} hasn't added any media yet.
              </p>
            </div>
          ) : (
            <div className="space-y-0 divide-y px-6">
              {activities.map((activity, index) => {
                const statusText = getStatusText(
                  activity.activityType,
                  activity.mediaType,
                  activity.status,
                  activity.progress,
                  activity.rating,
                  activity.review
                );
                const creatorLabel = getCreatorLabel(activity.mediaType);
                const MediaIcon = getMediaTypeIcon(activity.mediaType);

                return (
                  <div
                    key={`${activity.mediaId}-${index}`}
                    className="py-4 transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-28 h-40 relative overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
                        <Link
                          href={`/${activity.mediaType}/${activity.mediaId}`}
                        >
                          <Image
                            src={
                              activity.mediaCover ||
                              "/placeholder.svg?height=400&width=300"
                            }
                            alt={activity.mediaTitle}
                            fill
                            className="object-cover"
                          />
                        </Link>
                      </div>

                      <div className="flex flex-col flex-1">
                        <div className="mb-1 flex items-center gap-1">
                          {MediaIcon}
                          <span>{statusText}</span>
                          <span className="text-muted-foreground text-xs ml-2">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">
                          {activity.mediaTitle}
                        </h3>
                        {activity.mediaAuthor && (
                          <div className="text-muted-foreground mb-2">
                            {creatorLabel} {activity.mediaAuthor}
                          </div>
                        )}

                        {activity.rating && (
                          <StarDisplay rating={activity.rating} />
                        )}

                        {activity.progress && (
                          <div className="mt-2 mb-3">
                            <div className="text-sm font-medium">
                              Progress: {activity.progress}%
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${activity.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {activity.review && (
                          <div className="mb-4 mt-2">
                            <p className="line-clamp-3 italic">{`"${activity.review}"`}</p>
                          </div>
                        )}

                        <div className="mt-auto flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() =>
                              handleLike(activity.userId, activity.mediaId)
                            }
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                likedActivities.includes(
                                  `${activity.userId}-${activity.mediaId}`
                                )
                                  ? "fill-red-500 text-red-500"
                                  : ""
                              }`}
                            />
                            <span>Like</span>
                          </Button>
                          <div className="ml-auto">
                            <Link
                              href={`/${activity.mediaType}/${activity.mediaId}`}
                            >
                              <Button
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                <Info className="h-4 w-4" />
                                Get Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

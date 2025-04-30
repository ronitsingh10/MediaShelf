"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { isFollowing, toggleFollow } from "@/server/actions/follow-actions";

interface FollowButtonProps {
  userId: string;
  className?: string;
}

export default function FollowButton({ userId, className }: FollowButtonProps) {
  const [following, setFollowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkFollowStatus() {
      if (!userId) return;

      try {
        const result = await isFollowing(userId);
        setFollowing(result);
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkFollowStatus();
  }, [userId]);

  const handleClick = async () => {
    if (!userId || isLoading) return;

    try {
      // Optimistic update
      setFollowing(!following);

      const response = await toggleFollow(userId);

      if (!response.success) {
        // Revert on failure
        setFollowing(following);
        toast.error("Failed to update follow status");
      }
    } catch (error) {
      // Revert on error
      setFollowing(following);
      toast.error("Something went wrong");
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <Button
      variant={following ? "outline" : "default"}
      className={cn(
        "font-medium transition-all",
        following &&
          "border-gray-200 bg-white text-black hover:bg-red-50 hover:text-red-600",
        isLoading && "opacity-50",
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={isLoading}
    >
      {following ? (
        <>
          {isHovering ? (
            "Unfollow"
          ) : (
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              Following
            </span>
          )}
        </>
      ) : (
        "Follow"
      )}
    </Button>
  );
}

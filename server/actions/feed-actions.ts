"use server";

import { db } from "@/server/index";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { user, media } from "@/server/schema";
import { eq } from "drizzle-orm";
import redis from "@/lib/redis";

// Helper function to get session (reuse from your code)
const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        error: "Authentication required",
        statusCode: 401,
      };
    }

    return { success: true, session };
  } catch (error) {
    console.error("Session validation error:", error);
    return { success: false, error: "Session error", statusCode: 500 };
  }
};

// Add activity to the feed when user interacts with media
export const addActivityToFeed = async (activityData) => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return sessionResult;
  }

  const session = sessionResult.session;
  const userId = session.user.id;

  try {
    const {
      mediaId,
      mediaType,
      activityType, // e.g., "added", "updated", "rated", "progress", "completed"
      status,
      rating,
      progress,
      review, // e.g., "50% done with"
    } = activityData;

    // Create activity entry
    const activity = {
      userId,
      mediaId,
      mediaType,
      activityType,
      status,
      rating,
      progress,
      review,
      timestamp: Date.now(),
    };

    // Get media details
    const mediaDetails = await db
      .select()
      .from(media)
      .where(eq(media.id, mediaId), eq(media.mediaType, mediaType))
      .limit(1);

    if (mediaDetails.length === 0) {
      return {
        success: false,
        message: "Media not found",
      };
    }

    // Add media info to activity
    activity.mediaTitle = mediaDetails[0].title;
    activity.mediaCover = mediaDetails[0].cover;
    activity.mediaAuthor = mediaDetails[0].author;

    // Get user details
    const userDetails = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userDetails.length === 0) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Add user info to activity
    activity.userName = userDetails[0].userName;
    activity.Name = userDetails[0].name;
    activity.userImage = userDetails[0].image;

    // Generate a unique activity ID
    const activityId = `activity:${userId}:${mediaId}:${Date.now()}`;

    // Store the activity in Redis
    await redis.set(activityId, JSON.stringify(activity));

    // Add to user's activity stream (using sorted set with timestamp as score)
    await redis.zadd(`user:${userId}:activities`, Date.now(), activityId);

    // Add to the feed of all followers (fan-out)
    const followers = await redis.smembers(`followers:${userId}`);

    const pipeline = redis.pipeline();
    for (const followerId of followers) {
      pipeline.zadd(`feed:${followerId}`, Date.now(), activityId);
    }
    await pipeline.exec();

    return { success: true };
  } catch (error) {
    console.error("Add activity error:", error);
    return {
      success: false,
      message: "Failed to add activity",
      error,
    };
  }
};

// Get the feed for the current user
export const getFeed = async (page = 1, limit = 20) => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return sessionResult;
  }

  const session = sessionResult.session;
  const userId = session.user.id;

  try {
    // Get activity IDs from the feed sorted set (newest first)
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // const activityIds = await redis.zrange(`feed:${userId}`, start, end, {
    //   rev: true,
    // });

    const activityIds = await redis.zrevrange(`feed:${userId}`, start, end);

    console.log(activityIds);

    if (activityIds.length === 0) {
      return { success: true, data: [] };
    }

    // Get the actual activity data for each ID
    const pipeline = redis.pipeline();
    for (const id of activityIds) {
      pipeline.get(id);
    }

    const results = await pipeline.exec();

    console.log(results);

    const activities = results
      .filter(([err, val]) => !err && val !== null)
      .map(([_, val]) => JSON.parse(val!));

    // const activities = results
    //   .filter((result) => result !== null)
    //   .map((result) => JSON.parse(result));

    return { success: true, data: activities };
  } catch (error) {
    console.error("Get feed error:", error);
    return {
      success: false,
      message: "Failed to get feed",
      data: [],
      error,
    };
  }
};

export const getActivity = async (userId) => {
  try {
    const activityIds = await redis.zrevrange(
      `user:${userId}:activities`,
      0,
      20
    );

    if (activityIds.length === 0) {
      return { success: true, data: [] };
    }

    // Get the actual activity data for each ID
    const pipeline = redis.pipeline();
    for (const id of activityIds) {
      pipeline.get(id);
    }

    const results = await pipeline.exec();

    console.log(results);

    const activities = results
      .filter(([err, val]) => !err && val !== null)
      .map(([_, val]) => JSON.parse(val!));

    return { success: true, data: activities };
  } catch (error) {
    console.error("Get feed error:", error);
    return {
      success: false,
      message: "Failed to get feed",
      data: [],
      error,
    };
  }
};

"use server";

import { db } from "@/server/index";
import { follows } from "@/server/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import redis from "@/lib/redis";

// Helper function to get session (reusing your existing function)
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

export const isFollowing = async (userIdToCheck) => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return false;
  }

  const session = sessionResult.session;
  const currentUserId = session.user.id;

  try {
    // Check if relationship exists in Redis
    const isFollowing = await redis.sismember(
      `following:${currentUserId}`,
      userIdToCheck
    );
    return isFollowing === 1;
  } catch (error) {
    console.error("Is following check error:", error);

    // Fallback to database if Redis fails
    try {
      const result = await db
        .select()
        .from(follows)
        .where(
          and(
            eq(follows.userId, currentUserId),
            eq(follows.followsId, userIdToCheck)
          )
        )
        .limit(1);

      return result.length > 0;
    } catch (dbError) {
      console.error("Database is following check error:", dbError);
      return false;
    }
  }
};

// Toggle follow status
export const toggleFollow = async (userIdToToggle) => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      success: false,
      message: "Authentication required",
      status: 401,
    };
  }

  const session = sessionResult.session;
  const currentUserId = session.user.id;

  if (currentUserId === userIdToToggle) {
    return {
      success: false,
      message: "You cannot follow yourself",
    };
  }

  try {
    // Check current following status
    const following = await isFollowing(userIdToToggle);

    if (following) {
      // Unfollow
      await db
        .delete(follows)
        .where(
          and(
            eq(follows.userId, currentUserId),
            eq(follows.followsId, userIdToToggle)
          )
        );

      // Remove from Redis
      await redis.srem(`following:${currentUserId}`, userIdToToggle);
      await redis.srem(`followers:${userIdToToggle}`, currentUserId);

      return {
        success: true,
        following: false,
        message: "User unfollowed",
      };
    } else {
      // Follow
      await db
        .insert(follows)
        .values({
          userId: currentUserId,
          followsId: userIdToToggle,
        })
        .onConflictDoNothing();

      // Add to Redis
      await redis.sadd(`following:${currentUserId}`, userIdToToggle);
      await redis.sadd(`followers:${userIdToToggle}`, currentUserId);

      return {
        success: true,
        following: true,
        message: "User followed",
      };
    }
  } catch (error) {
    console.error("Toggle follow error:", error);
    return {
      success: false,
      message: "Failed to update follow status",
      error,
    };
  }
};

export const followUser = async (userIdToFollow) => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      message: "Authentication required to follow users",
      ...sessionResult,
    };
  }

  const session = sessionResult.session;
  const currentUserId = session.user.id;

  if (currentUserId === userIdToFollow) {
    return {
      success: false,
      message: "You cannot follow yourself",
    };
  }

  try {
    await db
      .insert(follows)
      .values({
        userId: currentUserId,
        followsId: userIdToFollow,
      })
      .onConflictDoNothing();

    // Add to Redis followers/following sets
    await redis.sadd(`following:${currentUserId}`, userIdToFollow);
    await redis.sadd(`followers:${userIdToFollow}`, currentUserId);

    return { success: true, message: "User followed successfully" };
  } catch (error) {
    console.error("Follow user error:", error);
    return {
      success: false,
      message: "Failed to follow user",
      error,
    };
  }
};

export const unfollowUser = async (userIdToUnfollow) => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      message: "Authentication required to unfollow users",
      ...sessionResult,
    };
  }

  const session = sessionResult.session;
  const currentUserId = session.user.id;

  try {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.userId, currentUserId),
          eq(follows.followsId, userIdToUnfollow)
        )
      );

    // Remove from Redis followers/following sets
    await redis.srem(`following:${currentUserId}`, userIdToUnfollow);
    await redis.srem(`followers:${userIdToUnfollow}`, currentUserId);

    return { success: true, message: "User unfollowed successfully" };
  } catch (error) {
    console.error("Unfollow user error:", error);
    return {
      success: false,
      message: "Failed to unfollow user",
      error,
    };
  }
};

export const getMyFollowing = async () => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return false;
  }

  const session = sessionResult.session;
  const currentUserId = session.user.id;

  try {
    // Get the set of users that userId is following
    const followingIds = await redis.smembers(`following:${currentUserId}`);
    return { success: true, data: followingIds };
  } catch (error) {
    console.error("Get following error:", error);
    return {
      success: false,
      message: "Failed to get following users",
      error,
    };
  }
};

export const getFollowing = async (userId) => {
  try {
    // Get the set of users that userId is following
    const followingIds = await redis.smembers(`following:${userId}`);
    return { success: true, data: followingIds };
  } catch (error) {
    console.error("Get following error:", error);
    return {
      success: false,
      message: "Failed to get following users",
      error,
    };
  }
};

export const getFollowers = async (userId) => {
  try {
    // Get the set of users that follow userId
    const followerIds = await redis.smembers(`followers:${userId}`);
    return { success: true, data: followerIds };
  } catch (error) {
    console.error("Get followers error:", error);
    return {
      success: false,
      message: "Failed to get followers",
      error,
    };
  }
};

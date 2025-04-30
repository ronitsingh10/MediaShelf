"use server";

import { db } from "@/server/index";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { follows, user } from "../schema";
import { eq, and, like, count } from "drizzle-orm";
import { getUserMediaCount } from "./media-actions";

// Helper function to get session and handle errors
export const getSession = async () => {
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

export const checkUserName = async (username: string) => {
  const data = await db
    .select()
    .from(user)
    .where(eq(user.userName, username.toLowerCase()));

  return data.length === 0;
};

export const updateUserName = async (username: string) => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      message: "Authentication required!",
      ...sessionResult,
    };
  }

  const session = sessionResult.session;
  try {
    await db
      .update(user)
      .set({ userName: username })
      .where(eq(user.id, session.user.id));

    return { success: true, message: "Username updated" };
  } catch (error) {
    console.error("Update username error:", error);
    return {
      success: false,
      message: "Failed to update username",
      error,
    };
  }
};

export const getUserByUserName = async (search: string) => {
  const User = await db
    .select()
    .from(user)
    .where(eq(user.userName, search.toLowerCase()));
  if (User.length > 0) {
    const { followers, following } = await getUserFollowers(User[0].id);
    const mediaCount = await getUserMediaCount(User[0].id);
    return {
      ...User[0],
      followers,
      following,
      mediaCount,
      ...mediaCount,
    };
  }
  return null;
};

export const getUsers = async (search: string) => {
  const users = await db
    .select()
    .from(user)
    .where(like(user.userName, `%${search}%`));

  const usersWithCounts = await Promise.all(
    users.map(async (user) => {
      const { followers, following } = await getUserFollowers(user.id);
      return {
        ...user,
        followers,
        following,
      };
    })
  );

  return usersWithCounts;
};

const getUserFollowers = async (id: string) => {
  const following = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.userId, id));

  const followers = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followsId, id));

  return {
    followers: followers[0].count,
    following: following[0].count,
  };
};

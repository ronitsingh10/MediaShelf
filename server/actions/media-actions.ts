"use server";

import { db } from "@/server/index";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { media, userMedia, user } from "../schema";
import { eq, and, count, or, isNotNull } from "drizzle-orm";
import { mediaTypes } from "@/lib/constants";
import { addActivityToFeed } from "./feed-actions";

// Helper function to get session and handle errors
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

export const insertMedia = async (mediaData) => {
  try {
    await db
      .insert(media)
      .values({
        id: mediaData.id,
        mediaType: mediaData.type,
        title: mediaData.title,
        cover: mediaData.cover,
        year: mediaData.year,
        description: mediaData.description,
        author: mediaData.author,
        publisher: mediaData.publisher,
        genres: mediaData.genres,
        platforms: mediaData.platforms,
      })
      .onConflictDoNothing({
        target: [media.id, media.mediaType],
      });
    return { success: true };
  } catch (error) {
    console.error("Insert media error:", error);
    return { success: false, message: "Failed to insert media", error };
  }
};

export const insertUserMedia = async (mediaData) => {
  // const session = await auth.api.getSession({
  //   headers: await headers(), // you need to pass the headers object.
  // });

  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      message: "Authentication required to add to your library",
      ...sessionResult,
    };
  }

  // await insertMedia(mediaData);
  const mediaInsertResult = await insertMedia(mediaData);
  if (!mediaInsertResult.success) {
    return mediaInsertResult;
  }

  const session = sessionResult.session;

  try {
    await db.insert(userMedia).values({
      userId: session.user.id,
      mediaId: mediaData.id,
      mediaType: mediaData.type,
      status: "1",
    });

    await addActivityToFeed({
      mediaId: mediaData.id,
      mediaType: mediaData.type,
      activityType: "added",
      status: "1",
    });

    console.log("Added!!!!!", mediaData);

    return { success: true, message: "Added to library" };
  } catch (error) {
    if (error.code === "23505") {
      return { success: true, message: "Already in your collection" };
    }

    return {
      success: false,
      message: "Failed to add to library. Please try again!",
      error,
    };
  }
};

export const deleteUserMedia = async (mediaData) => {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      message: "Authentication required to remove from your library",
      ...sessionResult,
    };
  }
  const session = sessionResult.session;

  try {
    await db
      .delete(userMedia)
      .where(
        and(
          eq(userMedia.userId, session.user.id),
          eq(userMedia.mediaId, mediaData.id),
          eq(userMedia.mediaType, mediaData.type)
        )
      );

    console.log("Deleted!!!!! ", mediaData);

    return { success: true, message: "Deleted from library" };
  } catch (error) {
    console.error("Delete user media error:", error);
    return {
      success: false,
      message: "Failed to delete from library. Please try again!",
      error,
    };
  }
};

export const getUserMedia = async () => {
  // const session = await auth.api.getSession({
  //   headers: await headers(), // you need to pass the headers object.
  // });

  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      message: "Authentication required to get your library",
      ...sessionResult,
    };
  }
  const session = sessionResult.session;

  try {
    const records = await db
      .select({
        mediaId: media.id,
        mediaType: media.mediaType,
        title: media.title,
        cover: media.cover,
        year: media.year,
        description: media.description,
        author: media.author,
        publisher: media.publisher,
        genres: media.genres,
        platforms: media.platforms,
        status: userMedia.status,
        rating: userMedia.rating,
        notes: userMedia.notes,
      })
      .from(media)
      .innerJoin(
        userMedia,
        and(
          eq(media.id, userMedia.mediaId),
          eq(media.mediaType, userMedia.mediaType)
        )
      )
      .where(eq(userMedia.userId, session.user.id));

    return { success: true, data: records };
  } catch (error) {
    console.error("Get user media error:", error);
    return {
      success: false,
      message: "Failed to retrieve your library",
      data: [],
      error,
    };
  }
};

export const getUserMediaByUserId = async (userId) => {
  try {
    const records = await db
      .select({
        mediaId: media.id,
        mediaType: media.mediaType,
        title: media.title,
        cover: media.cover,
        year: media.year,
        description: media.description,
        author: media.author,
        publisher: media.publisher,
        genres: media.genres,
        platforms: media.platforms,
        status: userMedia.status,
        rating: userMedia.rating,
        notes: userMedia.notes,
      })
      .from(media)
      .innerJoin(
        userMedia,
        and(
          eq(media.id, userMedia.mediaId),
          eq(media.mediaType, userMedia.mediaType)
        )
      )
      .where(eq(userMedia.userId, userId));

    return { success: true, data: records };
  } catch (error) {
    console.error("Get user media error:", error);
    return {
      success: false,
      message: "Failed to retrieve your library",
      data: [],
      error,
    };
  }
};

export const getUserMediaDetails = async (mediaId: string, type: string) => {
  // const session = await auth.api.getSession({
  //   headers: await headers(), // you need to pass the headers object.
  // });

  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      message: "Authentication required to get media details from your library",
      ...sessionResult,
    };
  }
  const session = sessionResult.session;

  try {
    const record = await db
      .select()
      .from(userMedia)
      .where(
        and(
          eq(userMedia.userId, session.user.id),
          eq(userMedia.mediaId, mediaId),
          eq(userMedia.mediaType, type)
        )
      );

    if (!record.length) {
      return {
        success: false,
        message: "Media not found in your library",
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: record[0],
    };
  } catch (error) {
    console.error("Get user media details error:", error);
    return {
      success: false,
      message: "Failed to retrieve media details",
      error,
    };
  }
};

export const updateUserMedia = async (
  // updateRow: string,
  mediaId: string,
  type: string,
  updates: {
    status?: string;
    rating?: number;
    notes?: string /* other fields */;
    progress?: string;
  },
  progressPercentage?: string
  // newStatus?: string,
  // newRating?: number
) => {
  const sessionResult = await getSession();
  if (!sessionResult.success) {
    return {
      message: "Authentication required to update media",
      ...sessionResult,
    };
  }
  const session = sessionResult.session;

  console.log("Updating !!!!!", mediaId, type, updates);

  await db
    .update(userMedia)
    .set(updates)
    .where(
      and(
        eq(userMedia.userId, session.user.id),
        eq(userMedia.mediaId, mediaId),
        eq(userMedia.mediaType, type)
      )
    );

  let activityType = "updated";
  let progress = null;
  let review = null;

  console.log(updates.status, progressPercentage);

  if (updates.status) {
    if (updates.status === "2") {
      // In progress
      activityType = "progress";
      progress = progressPercentage; // This would ideally be actual progress
    } else if (updates.status === "3") {
      // Completed
      activityType = "completed";
    }
  } else if (updates.rating) {
    activityType = "rated";
  }

  if (updates.notes) {
    activityType = "review";
    review = updates.notes;
  }

  // Add activity to feed
  await addActivityToFeed({
    mediaId,
    mediaType: type,
    activityType,
    status: updates.status,
    rating: updates.rating,
    progress,
    review,
  });
};

export const getUserMediaCount = async (id: string) => {
  const result = await db
    .select({
      mediaType: userMedia.mediaType,
      status: userMedia.status,
      count: count(),
    })
    .from(userMedia)
    .where(eq(userMedia.userId, id))
    .groupBy(userMedia.mediaType, userMedia.status);

  const reshaped = {};
  for (const { key } of mediaTypes) {
    reshaped[key] = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      total: 0,
    };
  }
  for (const { mediaType, status, count } of result) {
    reshaped[mediaType][status] += count;
    reshaped[mediaType].total += count;
  }

  return reshaped;
};

export const getMediaReviews = async (mediaId, type) => {
  try {
    const reviews = await db
      .select()
      .from(userMedia)
      .leftJoin(user, eq(userMedia.userId, user.id))
      .where(
        and(
          eq(userMedia.mediaId, mediaId),
          eq(userMedia.mediaType, type),
          or(isNotNull(userMedia.notes), isNotNull(userMedia.rating))
        )
      );

    return { success: true, data: reviews };
  } catch (error) {
    console.error("Get media reviews error:", error);
    return {
      success: false,
      message: "Failed to retrieve reviews",
      error,
    };
  }
};

import redis, { redisKeys } from "./redis";

// Follow relationship management
export async function cacheFollow(followerId: string, followingId: string) {
  const pipeline = redis.pipeline();

  // Update sets
  pipeline.sadd(redisKeys.following(followerId), followingId);
  pipeline.sadd(redisKeys.followers(followingId), followerId);

  // Update counters
  pipeline.incr(redisKeys.followingCount(followerId));
  pipeline.incr(redisKeys.followersCount(followingId));

  // Set status indicator
  pipeline.set(redisKeys.followStatus(followerId, followingId), "1");

  await pipeline.exec();
}

export async function removeFollow(followerId: string, followingId: string) {
  const pipeline = redis.pipeline();

  pipeline.srem(redisKeys.following(followerId), followingId);
  pipeline.srem(redisKeys.followers(followingId), followerId);

  pipeline.decr(redisKeys.followingCount(followerId));
  pipeline.decr(redisKeys.followersCount(followingId));

  pipeline.del(redisKeys.followStatus(followerId, followingId));

  await pipeline.exec();
}

// Check follow status (faster than DB query)
export async function isFollowing(followerId: string, followingId: string) {
  return Boolean(
    await redis.exists(redisKeys.followStatus(followerId, followingId))
  );
}

// Activity & Feed management
export async function cacheActivity(activity: any) {
  // Store activity data
  await redis.hset(redisKeys.activity(activity.id), {
    id: activity.id,
    userId: activity.userId,
    type: activity.activityType,
    contentId: activity.contentId || "",
    mediaId: activity.mediaId || "",
    mediaType: activity.mediaType || "",
    content: activity.content || "",
    createdAt: activity.createdAt.toISOString(),
  });

  // Set TTL (e.g., 7 days)
  await redis.expire(redisKeys.activity(activity.id), 60 * 60 * 24 * 7);

  // Add to user's activity list
  await redis.zadd(
    redisKeys.userActivities(activity.userId),
    Date.now(),
    activity.id
  );
}

// Queue activity for feed distribution
export async function queueFeedDistribution(activity: any) {
  // Add to Redis List for processing by worker
  await redis.lpush(
    redisKeys.feedQueue,
    JSON.stringify({
      activityId: activity.id,
      userId: activity.userId,
      timestamp: Date.now(),
    })
  );
}

// Get user feed from cache
export async function getUserFeed(userId: string, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // Get activity IDs from user's feed (newest first)
  const activityIds = await redis.zrevrange(redisKeys.feed(userId), start, end);

  if (!activityIds.length) {
    return [];
  }

  // Get activity details in a pipeline
  const pipeline = redis.pipeline();
  activityIds.forEach((id) => {
    pipeline.hgetall(redisKeys.activity(id));
  });

  const results = await pipeline.exec();

  // Filter out any null results and map to activities
  return results
    .filter(([err, result]) => !err && result)
    .map(([_, data]) => data);
}

// Add activity to followers' feeds
export async function distributeActivityToFollowers(
  userId: string,
  activityId: string
) {
  // Get follower IDs
  const followerIds = await redis.smembers(redisKeys.followers(userId));

  if (!followerIds.length) {
    return;
  }

  // Add activity to each follower's feed
  const pipeline = redis.pipeline();
  const now = Date.now();

  // Include the user's own feed
  followerIds.push(userId);

  followerIds.forEach((followerId) => {
    // Add to feed with timestamp as score
    pipeline.zadd(redisKeys.feed(followerId), now, activityId);

    // Trim feed to prevent unlimited growth (keep last 1000 items)
    pipeline.zremrangebyrank(redisKeys.feed(followerId), 0, -1001);

    // Set TTL on feed (24 hours)
    pipeline.expire(redisKeys.feed(followerId), 60 * 60 * 24);
  });

  await pipeline.exec();
}

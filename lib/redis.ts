import { Redis } from "ioredis";

// Create Redis client
const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL);

export default redis;

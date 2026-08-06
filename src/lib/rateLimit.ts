import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export async function checkContactRateLimit(identifier: string) {
  const configured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!configured) return { success: process.env.NODE_ENV !== "production", configured: false };
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "liberty:contact",
  });
  const result = await limiter.limit(identifier);
  return { success: result.success, configured: true };
}

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export async function checkContactRateLimit(identifier: string) {
  const config = getRedisConfig();
  if (!config) return { success: process.env.NODE_ENV !== "production", configured: false };
  const limiter = new Ratelimit({
    redis: new Redis(config),
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "liberty:contact",
  });
  const result = await limiter.limit(identifier);
  return { success: result.success, configured: true };
}

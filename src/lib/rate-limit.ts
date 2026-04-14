// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60s'), // 5 attempts per 60 seconds
  analytics: true,
  prefix: 'auth:login', // namespaces the keys in Redis
});

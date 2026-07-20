// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60s'), // 5 attempts per 60 seconds
  analytics: true,
  prefix: 'auth:login', // namespaces the keys in Redis
});

/**
 * Guards the public contact form. Deliberately looser than the login limiter
 * (a genuine visitor may retry after a typo) but tight enough that a script
 * cannot use the form to blast our mailbox.
 */
export const contactRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '600s'), // 5 messages per 10 minutes
  analytics: true,
  prefix: 'public:contact',
});

// src/utils/revalidate-team.ts
import { revalidateTag } from 'next/cache';
import { TEAM_CACHE_TAG } from '@/config/cache';

/**
 * Invalidates the ISR cache for the public team section on the About page so
 * an admin change to a team member goes live immediately.
 */
export function revalidatePublishedTeam(): void {
  revalidateTag(TEAM_CACHE_TAG, 'max');
}

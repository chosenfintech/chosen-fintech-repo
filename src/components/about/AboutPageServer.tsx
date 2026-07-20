// src/components/about/AboutPageServer.tsx
import AboutPageClient from './AboutPageClient';
import type {
  ITeamMember,
  ITeamMembersPaginatedResponse,
} from '@/types/team/team-member.types';
import { TEAM_CACHE_TAG, POSTS_REVALIDATE_SECONDS } from '@/config/cache';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

/** No pagination on the public team grid - the whole roster is one section. */
const TEAM_LIMIT = 100;

async function fetchTeamMembers(): Promise<ITeamMember[]> {
  try {
    const url = new URL('/api/team/published', baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', TEAM_LIMIT.toString());

    const response = await fetch(url.toString(), {
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [TEAM_CACHE_TAG] },
    });

    if (!response.ok) {
      console.error('Failed to fetch team members');
      return [];
    }

    const data: ITeamMembersPaginatedResponse = await response.json();

    return data.data;
  } catch (err) {
    console.error('Error fetching team members:', err);
    return [];
  }
}

export default async function AboutPageServer() {
  const teamMembers = await fetchTeamMembers();

  return <AboutPageClient teamMembers={teamMembers} />;
}

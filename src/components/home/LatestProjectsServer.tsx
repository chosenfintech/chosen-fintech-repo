// src/components/home/LatestProjectsServer.tsx
import { LatestProjects } from './LatestProjects';
import {
  IProject,
  IProjectsPaginatedResponse,
} from '@/types/projects/project.types';
import { PROJECTS_CACHE_TAG, POSTS_REVALIDATE_SECONDS } from '@/config/cache';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function fetchLatestProjects(): Promise<IProject[]> {
  try {
    const url = new URL('/api/projects/published', baseUrl);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '3');

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [PROJECTS_CACHE_TAG] },
    });

    if (!response.ok) return [];

    const result: IProjectsPaginatedResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('Failed to fetch latest projects:', error);
    return [];
  }
}

export default async function LatestProjectsServer() {
  const projects = await fetchLatestProjects();
  return <LatestProjects projects={projects} />;
}

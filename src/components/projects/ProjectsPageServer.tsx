// src/components/projects/ProjectsPageServer.tsx
import ProjectsPageClient from './ProjectsPageClient';
import {
  IProject,
  IProjectsPaginatedResponse,
} from '@/types/projects/project.types';
import { PROJECTS_CACHE_TAG, POSTS_REVALIDATE_SECONDS } from '@/config/cache';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const PROJECTS_PER_PAGE = 9;

async function fetchProjects(page: number): Promise<IProjectsPaginatedResponse> {
  try {
    const url = new URL('/api/projects/published', baseUrl);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(PROJECTS_PER_PAGE));

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: POSTS_REVALIDATE_SECONDS, tags: [PROJECTS_CACHE_TAG] },
    });

    if (!response.ok) {
      return {
        message: 'Error',
        data: [],
        meta: { total: 0, page: 1, limit: PROJECTS_PER_PAGE, totalPages: 1 },
      };
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return {
      message: 'Error',
      data: [],
      meta: { total: 0, page: 1, limit: PROJECTS_PER_PAGE, totalPages: 1 },
    };
  }
}

export default async function ProjectsPageServer({ page }: { page: number }) {
  const response = await fetchProjects(page);
  const projects: IProject[] = response.data;

  return (
    <ProjectsPageClient
      projects={projects}
      currentPage={page}
      totalPages={response.meta.totalPages ?? 1}
    />
  );
}

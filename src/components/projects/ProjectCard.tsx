// src/components/projects/ProjectCard.tsx
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Project } from '@/static-data/projects';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <Card className="overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 h-full flex flex-col">
        <CardContent className="p-6 flex flex-col items-center text-center">
          {/* Project Image/Logo Area */}
          <div className="w-full aspect-square max-w-50 p-6 flex justify-center items-center bg-white rounded-xl mb-6 transition-transform duration-300 group-hover:scale-105">
            <div className="relative w-full h-full">
              <Image
                src={project.imageUrl}
                alt={`${project.title} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
              />
            </div>
          </div>

          {/* Project Title */}
          <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Project Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Read More */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300 mt-auto">
            Read More
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

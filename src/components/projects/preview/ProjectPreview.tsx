// src/components/projects/preview/AdminProjectPreview.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { IProject } from "@/types/projects/project.types";
import ProjectPreviewHeader from "./Header";
import ProjectContentDisplay from "./ContentDisplay";
import ProjectMetadataSidebar from "./MetadataSidebar";

interface IProjectPreviewProps {
  project: IProject;
  onEdit?: () => void;
  onTogglePublish?: () => void;
  onToggleFeature?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export default function ProjectPreview({
  project,
  onEdit,
  onTogglePublish,
  onToggleFeature,
  onBack,
  isLoading = false,
}: IProjectPreviewProps) {
  return (
    <div className="container min-h-screen bg-background">
      <div className="mx-auto space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack || (() => window.history.back())}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back
        </Button>

        <ProjectPreviewHeader
          project={project}
          onEdit={onEdit}
          onTogglePublish={onTogglePublish}
          onToggleFeature={onToggleFeature}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <ProjectContentDisplay project={project} />
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <ProjectMetadataSidebar project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}

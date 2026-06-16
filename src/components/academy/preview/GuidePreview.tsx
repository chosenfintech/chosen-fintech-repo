// src/components/guides/preview/AdminGuidePreview.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { IGuide } from "@/types/guides/guide.types";
import GuidePreviewHeader from "./Header";
import GuideContentDisplay from "./ContentDisplay";
import GuideMetadataSidebar from "./MetadataSidebar";

interface IGuidePreviewProps {
  guide: IGuide;
  onEdit?: () => void;
  onTogglePublish?: () => void;
  onToggleFeature?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export default function GuidePreview({
  guide,
  onEdit,
  onTogglePublish,
  onToggleFeature,
  onBack,
  isLoading = false,
}: IGuidePreviewProps) {
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

        <GuidePreviewHeader
          guide={guide}
          onEdit={onEdit}
          onTogglePublish={onTogglePublish}
          onToggleFeature={onToggleFeature}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <GuideContentDisplay guide={guide} />
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <GuideMetadataSidebar guide={guide} />
          </div>
        </div>
      </div>
    </div>
  );
}

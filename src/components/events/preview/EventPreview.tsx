// src/components/events/preview/AdminEventPreview.tsx
"use client";
import { ArrowLeft } from "lucide-react";
import { BackLink } from "@/components/BackLink";
import { IEvent } from "@/types/events/event.types";
import EventPreviewHeader from "./Header";
import EventContentDisplay from "./ContentDisplay";
import EventMetadataSidebar from "./MetadataSidebar";

interface IEventPreviewProps {
  event: IEvent;
  onEdit?: () => void;
  onTogglePublish?: () => void;
  onToggleFeature?: () => void;
  isLoading?: boolean;
}

export default function EventPreview({
  event,
  onEdit,
  onTogglePublish,
  onToggleFeature,
  isLoading = false,
}: IEventPreviewProps) {
  return (
    <div className="container min-h-screen bg-background">
      <div className="mx-auto space-y-8">
        {/* Back Button */}
        <BackLink href="/dashboard/events">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back
        </BackLink>

        <EventPreviewHeader
          event={event}
          onEdit={onEdit}
          onTogglePublish={onTogglePublish}
          onToggleFeature={onToggleFeature}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <EventContentDisplay event={event} />
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <EventMetadataSidebar event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}

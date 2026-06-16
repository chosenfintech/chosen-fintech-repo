// src/components/events/detail/Header.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { IEvent } from '@/types/events/event.types';
import { AuthorMetaCard } from './AuthorMetaCard';

interface HeaderProps {
  event: IEvent;
}

const formatEventDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const Header: React.FC<HeaderProps> = ({ event }) => {
  return (
    <header className="w-full mb-10">
      {/* EventCategory */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-5"
      >
        {event.category?.name && (
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="w-4 h-px bg-primary" />
            {event.category.name}
          </span>
        )}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.15] tracking-tight mb-5 break-words"
      >
        {event.title}
      </motion.h1>

      {/* Excerpt */}
      {event.excerpt && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed mb-6 break-words"
        >
          {event.excerpt}
        </motion.p>
      )}

      {/* Byline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <AuthorMetaCard event={event} />
      </motion.div>

      {/* Event details */}
      {(event.eventDate || event.location || event.startTime) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-6 flex flex-wrap gap-x-6 gap-y-3 rounded-xl border border-border bg-muted/30 p-4"
        >
          {event.eventDate && (
            <span className="flex items-center gap-2 text-sm text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              {formatEventDate(event.eventDate)}
            </span>
          )}
          {(event.startTime || event.endTime) && (
            <span className="flex items-center gap-2 text-sm text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              {event.startTime}
              {event.endTime ? ` – ${event.endTime}` : ''}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-2 text-sm text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {event.location}
            </span>
          )}
        </motion.div>
      )}

      {/* Cover image */}
      {event.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 w-full"
        >
          <div className="aspect-[16/9] overflow-hidden rounded-xl border border-border w-full">
            <Image
              src={event.coverImage}
              alt={event.title}
              width={1200}
              height={675}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      )}
    </header>
  );
};

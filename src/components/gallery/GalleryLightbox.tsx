// src/components/gallery/GalleryLightbox.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import type { IGalleryPhoto } from '@/types/gallery/gallery-photo.types';

interface GalleryLightboxProps {
  open: boolean;
  photos: IGalleryPhoto[];
  index: number;
  title?: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

export function GalleryLightbox({
  open,
  photos,
  index,
  title,
  onClose,
  onIndexChange,
}: GalleryLightboxProps) {
  const [direction, setDirection] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  const photo = photos[index];
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;
  const albumHasCaptions = photos.some((p) => p.caption);

  const goTo = React.useCallback(
    (next: number) => {
      if (next < 0 || next >= photos.length) return;
      setDirection(next > index ? 1 : -1);
      onIndexChange(next);
    },
    [index, photos.length, onIndexChange],
  );

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goTo(index - 1);
      if (event.key === 'ArrowRight') goTo(index + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, index, goTo, onClose]);

  // Scroll lock + initial focus
  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Show the loader until the current slide's image arrives
  React.useEffect(() => {
    setLoaded(false);
  }, [index]);

  // Warm the browser cache for neighbouring slides
  React.useEffect(() => {
    if (!open) return;
    [index - 1, index + 1].forEach((i) => {
      const neighbour = photos[i];
      if (neighbour) {
        const img = new window.Image();
        img.src = neighbour.url;
      }
    });
  }, [open, index, photos]);

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? 'Photo viewer'}
          onClick={onClose}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-w-0">
              {title && (
                <p className="text-white text-sm sm:text-base font-medium truncate">
                  {title}
                </p>
              )}
              <p className="text-white/50 text-xs sm:text-sm tabular-nums mt-0.5">
                {index + 1} / {photos.length}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 flex items-center justify-center w-10 h-10 cursor-pointer text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={photo.id}
                className="absolute inset-0 px-2 sm:px-16 pb-2 cursor-grab active:cursor-grabbing"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                drag={photos.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (
                    info.offset.x < -SWIPE_DISTANCE ||
                    info.velocity.x < -SWIPE_VELOCITY
                  ) {
                    goTo(index + 1);
                  } else if (
                    info.offset.x > SWIPE_DISTANCE ||
                    info.velocity.x > SWIPE_VELOCITY
                  ) {
                    goTo(index - 1);
                  }
                }}
                onClick={(event) => event.stopPropagation()}
              >
                {!loaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                  </div>
                )}
                <Image
                  src={photo.url}
                  alt={photo.altText ?? title ?? 'Gallery photo'}
                  fill
                  sizes="100vw"
                  priority
                  draggable={false}
                  className={`object-contain transition-opacity duration-300 ${
                    loaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>

            {/* Arrows (pointer devices; swipe covers touch) */}
            {hasPrev && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(index - 1);
                }}
                className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 cursor-pointer text-white/70 bg-white/5 hover:bg-white/15 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {hasNext && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(index + 1);
                }}
                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 cursor-pointer text-white/70 bg-white/5 hover:bg-white/15 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Caption — bar is kept when the album has captions so the stage doesn't jump */}
          {albumHasCaptions && (
            <div
              className="px-6 pb-6 pt-3 text-center min-h-14"
              onClick={(event) => event.stopPropagation()}
            >
              {photo.caption && (
                <p className="text-white/70 text-sm max-w-xl mx-auto leading-relaxed">
                  {photo.caption}
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

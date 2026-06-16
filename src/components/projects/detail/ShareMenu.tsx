// src/components/projects/detail/ShareMenu.tsx
'use client';

import React, { useState } from 'react';
import {
  Check,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Share2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import toast from 'react-hot-toast';

interface ShareMenuProps {
  projectTitle: string;
}

export const ShareMenu: React.FC<ShareMenuProps> = ({ projectTitle }) => {
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: 'Copy link',
      icon: copied ? Check : Copy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          toast.success('Link copied!');
          setTimeout(() => setCopied(false), 2000);
        } catch {
          toast.error('Failed to copy link');
        }
      },
    },
    {
      name: 'Share on X',
      icon: Twitter,
      action: () => {
        const text = encodeURIComponent(
          `${projectTitle}\n\n${window.location.href}`,
        );
        window.open(
          `https://twitter.com/intent/tweet?text=${text}`,
          '_blank',
          'noopener,noreferrer',
        );
      },
    },
    {
      name: 'Share on LinkedIn',
      icon: Linkedin,
      action: () => {
        const url = encodeURIComponent(window.location.href);
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
          '_blank',
          'noopener,noreferrer',
        );
      },
    },
    {
      name: 'Share on Facebook',
      icon: Facebook,
      action: () => {
        const url = encodeURIComponent(window.location.href);
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          '_blank',
          'noopener,noreferrer',
        );
      },
    },
    {
      name: 'Share via email',
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(`Check out: ${projectTitle}`);
        const body = encodeURIComponent(
          `${projectTitle}\n${window.location.href}`,
        );
        window.open(`mailto:?subject=${subject}&body=${body}`);
      },
    },
  ];

  const iconClass = 'h-4 w-4';

  const btnClass =
    'flex items-center cursor-pointer justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors';

  return (
    <TooltipProvider delayDuration={300}>
      {/* Desktop: vertical icon rail */}
      <div className="hidden lg:flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Share
        </span>
        {shareOptions.map((opt) => (
          <Tooltip key={opt.name}>
            <TooltipTrigger asChild>
              <button
                onClick={opt.action}
                className={btnClass}
                aria-label={opt.name}
              >
                <opt.icon className={iconClass} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">{opt.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Mobile: horizontal bottom bar */}
      <div className="flex lg:hidden items-center justify-between w-full px-1">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </span>
        <div className="flex items-center gap-1">
          {shareOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={opt.action}
              className={btnClass}
              aria-label={opt.name}
            >
              <opt.icon className={iconClass} />
            </button>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

// src/components/events/preview/ContentDisplay.tsx
import Image from 'next/image';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { IEvent } from '@/types/events/event.types';

interface IEventContentDisplayProps {
  event: IEvent;
}

export default function EventContentDisplay({ event }: IEventContentDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Cover Image */}
      {event.coverImage && (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="relative w-full h-64 sm:h-80 lg:h-96">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  Cover Image
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6 lg:p-8 hover:shadow-md transition-shadow duration-200">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Content
        </h2>

        {/* Event Content */}
        <div
          className="
    message-content
    w-full
    text-sm md:text-base
    leading-relaxed
    text-foreground
    break-words
    overflow-wrap-anywhere
    /* paragraphs */
    [&_p]:my-3 [&_p]:leading-7
    [&_p:first-child]:mt-0 [&_p:last-child]:mb-0
    /* headings */
    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-5 [&_h1]:tracking-tight
    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-4 [&_h2]:tracking-tight
    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-3
    [&_h4]:text-base [&_h4]:font-semibold [&_h4]:my-2
    /* links */
    [&_a]:text-blue-600
    [&_a:hover]:text-blue-700
    dark:[&_a]:text-blue-400
    dark:[&_a:hover]:text-blue-300
    [&_a]:underline [&_a]:underline-offset-2
    [&_a]:transition-colors
    /* lists */
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1
    [&_li]:my-1 [&_li]:leading-7
    [&_li>p]:my-1
    /* nested lists */
    [&_li_ul]:my-2 [&_li_ol]:my-2
    /* blockquotes */
    [&_blockquote]:border-l-4 [&_blockquote]:border-primary
    [&_blockquote]:bg-primary/5 [&_blockquote]:pl-4 [&_blockquote]:py-3
    [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:rounded-r-md
    /* inline code */
    [&_:not(pre)_code]:bg-muted [&_:not(pre)_code]:px-1.5 
    [&_:not(pre)_code]:py-0.5 [&_:not(pre)_code]:rounded
    [&_:not(pre)_code]:text-[0.9em] [&_:not(pre)_code]:font-mono
    /* code blocks */
    [&_pre]:bg-slate-900 [&_pre]:text-slate-50 [&_pre]:rounded-lg
    [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:text-sm
    [&_pre]:border [&_pre]:border-slate-800
    dark:[&_pre]:bg-slate-950 dark:[&_pre]:border-slate-800
    [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
    /* tables */
    [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
    [&_table]:text-sm [&_table]:border [&_table]:border-border [&_table]:rounded-lg
    [&_thead]:bg-muted/50
    [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2.5 
    [&_th]:text-left [&_th]:font-semibold
    [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2
    [&_tbody_tr:hover]:bg-muted/30 [&_tbody_tr]:transition-colors
    /* images */
    [&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4
    /* horizontal rules */
    [&_hr]:my-6 [&_hr]:border-t [&_hr]:border-border
    /* strong/bold */
    [&_strong]:font-semibold [&_strong]:text-foreground
    /* emphasis */
    [&_em]:italic
  "
          dangerouslySetInnerHTML={{ __html: event.content }}
        />
      </div>
    </div>
  );
}

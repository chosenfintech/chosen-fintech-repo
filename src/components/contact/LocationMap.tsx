// src/components/contact/LocationMap.tsx
'use client';

import { useState } from 'react';
import { Loader2, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

// Office location - Nakoha St, Kakpagyili, Tamale, Ghana (GPS: NT-0198-9161).
// Coordinates resolved from the GhanaPostGPS digital address; adjust if the pin
// needs to sit more precisely on the office.
const OFFICE_LAT = 9.470891;
const OFFICE_LNG = -0.87344;
const OFFICE_LABEL = 'Chosen Fintech Solutions';

interface LocationMapProps {
  /** Frame sizing. Defaults to filling its grid cell on large screens. */
  className?: string;
}

export function LocationMap({ className }: LocationMapProps) {
  const [isLoading, setIsLoading] = useState(true);

  // `q=label@lat,lng` drops a labelled pin at the exact spot (the `pb=` form
  // only frames an area, with no marker). `z` controls the initial zoom. This
  // keyless embed needs no Maps API key.
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${OFFICE_LABEL}@${OFFICE_LAT},${OFFICE_LNG}`,
  )}&t=&z=16&ie=UTF8&iwloc=B&output=embed`;

  // Turn-by-turn directions from wherever the visitor currently is.
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_LAT},${OFFICE_LNG}`;

  return (
    <div
      className={cn(
        'group relative w-full overflow-hidden bg-muted/30',
        'h-[78vw] max-h-[440px] lg:h-full lg:max-h-none',
        className,
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              strokeWidth={1.5}
              className="h-8 w-8 animate-spin text-primary"
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Loading map
            </p>
          </div>
        </div>
      )}

      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{
          border: 0,
          // Muted at rest so it reads as a backdrop next to the form; hover
          // brings it to full colour. Only 35% grey, so the red pin stays legible.
          filter: 'grayscale(35%) contrast(1.05) opacity(0.95)',
        }}
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        referrerPolicy="no-referrer-when-downgrade"
        title="Chosen Fintech Solutions office location"
        className="h-full w-full transition-all duration-700 ease-out group-hover:opacity-100 group-hover:brightness-100 group-hover:filter-none motion-reduce:transition-none"
      />

      {/* Always visible - phones have no hover, so neither control is hover-gated. */}
      {/* pb clears Google's own attribution bar along the bottom edge. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 pb-10 sm:p-6 sm:pb-12">
        <span className="pointer-events-auto w-fit bg-background/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground shadow-sm backdrop-blur-md">
          Kakpagyili, Tamale
        </span>

        <a
          href={directionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto ml-auto flex w-fit items-center gap-2 bg-background/90 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground shadow-sm backdrop-blur-md transition-colors duration-300 hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-5"
        >
          <Navigation className="h-3.5 w-3.5" strokeWidth={1.5} />
          Get directions
        </a>
      </div>
    </div>
  );
}

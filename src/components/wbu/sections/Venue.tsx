import { ExternalLink, MapPin } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { EditableImage } from "../EditableImage";
import { EditableText } from "../EditableText";
import { Reveal, SectionHeading } from "../primitives";

const { venue } = worldBetweenUsConfig;

export function Venue() {
  return (
    <section id="venue" className="relative py-24">
      <div className="section-shell">
        <SectionHeading overline="The Venue" title={venue.title} titleId="venue-title" />

        <Reveal delay={80}>
          <EditableImage
            id="venue-image"
            src={venue.image}
            alt={venue.name}
            ratio="4 / 5"
            overlay="bottom"
            className="mt-12 rounded-sm border border-steel/40 shadow-[var(--shadow-soft)]"
          />
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-8 text-center">
            <EditableText
              id="venue-name"
              value={venue.name}
              as="h3"
              className="font-display text-3xl font-light text-ivory"
            />
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-cloud/75">
              <MapPin className="size-4 shrink-0 text-champagne" />
              <EditableText id="venue-address" value={venue.address} />
            </p>
            <EditableText
              id="venue-note"
              value={venue.note}
              as="p"
              multiline
              className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-cloud/55"
            />

            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-champagne/50 px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-ivory transition hover:bg-champagne hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              {venue.mapsLabel}
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

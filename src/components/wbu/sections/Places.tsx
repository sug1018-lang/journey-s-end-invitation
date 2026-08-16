import { Car, ExternalLink, MapPin, Navigation, Train } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { directionsUrl, fullAddress, mapsSearchUrl } from "@/lib/locations";
import { EditableImage } from "../EditableImage";
import { useEditMode } from "../edit-mode";
import { Reveal, SectionHeading } from "../primitives";

const { places } = worldBetweenUsConfig;

export function Places() {
  const { getLocation } = useEditMode();
  const items = places.locationIds
    .map((id) => getLocation(id))
    .filter((location) => location && location.enabled !== false);

  if (!items.length) return null;

  return (
    <section id="places" className="relative py-24">
      <div className="section-shell">
        <SectionHeading overline={places.subtitle} title={places.title} titleId="places-title" />

        <div className="mt-12 space-y-12">
          {items.map((location, index) => {
            if (!location) return null;
            const maps = mapsSearchUrl(location);
            const directions = directionsUrl(location);
            const address = fullAddress(location);

            return (
              <Reveal key={location.id} delay={index * 80}>
                <article className="rounded-sm border border-steel/40 bg-deep/30 p-4 backdrop-blur-sm">
                  {location.image ? (
                    <EditableImage
                      id={location.imageId ?? `location-${location.id}-image`}
                      src={location.image}
                      alt={location.imageAlt ?? location.venueName ?? location.label}
                      ratio="4 / 3"
                      overlay="bottom"
                      className="rounded-sm border border-steel/40 shadow-[var(--shadow-soft)]"
                    />
                  ) : null}

                  <h3 className="mt-5 font-display text-2xl font-light text-ivory">
                    {location.venueName || location.label}
                  </h3>

                  {address ? (
                    <p className="mt-3 flex items-start justify-center gap-2 text-sm text-cloud/75">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-champagne" />
                      <span>{address}</span>
                    </p>
                  ) : null}

                  {location.notes ? (
                    <p className="mt-3 text-xs leading-relaxed text-cloud/60">{location.notes}</p>
                  ) : null}

                  <ul className="mt-4 space-y-2 text-xs text-cloud/60">
                    {location.transport ? (
                      <li className="flex items-start gap-2">
                        <Train className="mt-0.5 size-3.5 shrink-0 text-champagne/80" />
                        <span>{location.transport}</span>
                      </li>
                    ) : null}
                    {location.parking ? (
                      <li className="flex items-start gap-2">
                        <Car className="mt-0.5 size-3.5 shrink-0 text-champagne/80" />
                        <span>{location.parking}</span>
                      </li>
                    ) : null}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {maps ? (
                      <a
                        href={maps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-champagne/50 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ivory transition hover:bg-champagne hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                      >
                        Google Maps
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                    {directions ? (
                      <a
                        href={directions}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-cloud/25 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-cloud/80 transition hover:border-champagne hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                      >
                        Itinéraire
                        <Navigation className="size-3.5" />
                      </a>
                    ) : null}
                    {location.websiteUrl ? (
                      <a
                        href={location.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-cloud/25 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-cloud/80 transition hover:border-champagne hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                      >
                        Site web
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { GlassWater, MapPin, Music4, Users, UtensilsCrossed, Heart, type LucideIcon } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { mapsSearchUrl } from "@/lib/locations";
import { EditableText } from "../EditableText";
import { useEditMode } from "../edit-mode";
import { Reveal, SectionHeading } from "../primitives";

const { schedule } = worldBetweenUsConfig;

const icons: Record<string, LucideIcon> = {
  arrival: Users,
  ceremony: Heart,
  cocktail: GlassWater,
  dinner: UtensilsCrossed,
  party: Music4,
};

export function Schedule() {
  const { getLocation } = useEditMode();

  return (
    <section id="schedule" className="relative py-24">
      <div className="section-shell">
        <SectionHeading overline={schedule.subtitle} title={schedule.title} titleId="schedule-title" />

        <ol className="mt-14 space-y-3">
          {schedule.items.map((item, index) => {
            const Icon = icons[item.icon] ?? Heart;
            const location = getLocation(item.locationId);
            const placeName = location?.venueName || location?.label || "";
            const maps = mapsSearchUrl(location);

            return (
              <li key={item.id}>
                <Reveal delay={index * 60}>
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-sm border border-steel/40 bg-deep/40 p-4 backdrop-blur-sm">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full border border-champagne/35 bg-ink/50">
                      <Icon className="size-4 text-champagne" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <EditableText
                          id={`${item.id}-time`}
                          value={item.time}
                          className="font-display text-xl text-champagne"
                        />
                        <EditableText
                          id={`${item.id}-title`}
                          value={item.title}
                          className="font-display text-xl font-light text-ivory"
                        />
                      </div>
                      <EditableText
                        id={`${item.id}-description`}
                        value={item.description}
                        as="p"
                        multiline
                        className="mt-1 text-sm leading-relaxed text-cloud/70"
                      />
                      {placeName ? (
                        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] tracking-[0.1em] text-cloud/55">
                          <MapPin className="size-3 shrink-0 text-champagne/70" />
                          {maps ? (
                            <a
                              href={maps}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline-offset-4 transition hover:text-ivory hover:underline"
                            >
                              {placeName}
                            </a>
                          ) : (
                            <span>{placeName}</span>
                          )}
                        </p>
                      ) : null}
                      {item.dressCode ? (
                        <p className="mt-1 text-[11px] text-cloud/45">{item.dressCode}</p>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

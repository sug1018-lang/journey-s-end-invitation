import { MapPin } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { EditableImage } from "../EditableImage";
import { EditableText } from "../EditableText";
import { Reveal, SectionHeading } from "../primitives";

const { journey } = worldBetweenUsConfig;

export function Journey() {
  return (
    <section id="journey" className="relative py-24">
      <div className="section-shell">
        <SectionHeading
          overline={journey.subtitle}
          title={journey.title}
          subtitle={journey.intro}
          titleId="journey-title"
        />

        <div className="relative mt-16">
          {/* travel line */}
          <div className="absolute bottom-0 left-[13px] top-2 w-px bg-[linear-gradient(to_bottom,transparent,var(--champagne)_12%,var(--champagne)_85%,transparent)] opacity-50" />

          <ol className="space-y-14">
            {journey.items.map((item, index) => (
              <li key={item.id} className="relative pl-11">
                <Reveal delay={index * 60}>
                  <span
                    className="absolute left-[7px] top-2 size-3 rounded-full bg-champagne"
                    style={{ boxShadow: "0 0 0 4px rgba(199,166,106,.15), 0 0 18px 4px rgba(199,166,106,.4)" }}
                    aria-hidden="true"
                  />
                  <EditableText
                    id={`${item.id}-date`}
                    value={item.date}
                    as="p"
                    className="text-[10px] uppercase tracking-[0.28em] text-champagne/85"
                  />
                  <EditableText
                    id={`${item.id}-title`}
                    value={item.title}
                    as="h3"
                    className="mt-2 font-display text-2xl font-light text-ivory"
                  />
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-cloud/60">
                    <MapPin className="size-3 shrink-0 text-champagne/70" />
                    <EditableText id={`${item.id}-place`} value={item.place} />
                  </p>

                  <EditableImage
                    id={`${item.id}-image`}
                    src={item.image}
                    alt={item.title}
                    ratio="4 / 3"
                    overlay="soft"
                    className="mt-5 rounded-sm border border-steel/40 shadow-[var(--shadow-soft)]"
                  />

                  <EditableText
                    id={`${item.id}-text`}
                    value={item.text}
                    as="p"
                    multiline
                    className="mt-5 text-sm leading-[1.85] text-cloud/75"
                  />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

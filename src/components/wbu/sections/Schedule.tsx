import { GlassWater, Music4, Users, UtensilsCrossed, Heart, type LucideIcon } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { EditableText } from "../EditableText";
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
  return (
    <section id="schedule" className="relative py-24">
      <div className="section-shell">
        <SectionHeading overline={schedule.subtitle} title={schedule.title} titleId="schedule-title" />

        <ol className="mt-14 space-y-3">
          {schedule.items.map((item, index) => {
            const Icon = icons[item.icon] ?? Heart;
            return (
              <li key={item.time}>
                <Reveal delay={index * 60}>
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-sm border border-steel/40 bg-deep/40 p-4 backdrop-blur-sm">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full border border-champagne/35 bg-ink/50">
                      <Icon className="size-4 text-champagne" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <EditableText
                          id={`schedule-${index}-time`}
                          value={item.time}
                          className="font-display text-xl text-champagne"
                        />
                        <EditableText
                          id={`schedule-${index}-title`}
                          value={item.title}
                          className="font-display text-xl font-light text-ivory"
                        />
                      </div>
                      <EditableText
                        id={`schedule-${index}-description`}
                        value={item.description}
                        as="p"
                        multiline
                        className="mt-1 text-sm leading-relaxed text-cloud/70"
                      />
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

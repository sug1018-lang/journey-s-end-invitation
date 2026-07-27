import { BedDouble, Plane } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { EditableText } from "../EditableText";
import { Reveal, SectionHeading } from "../primitives";

const { accommodation } = worldBetweenUsConfig;

export function Accommodation() {
  const groups = [
    { key: "stay", icon: BedDouble, label: "Where to stay", items: accommodation.stays },
    { key: "travel", icon: Plane, label: "How to get there", items: accommodation.travel },
  ];

  return (
    <section id="accommodation" className="relative py-24">
      <div className="section-shell">
        <SectionHeading
          overline={accommodation.subtitle}
          title={accommodation.title}
          titleId="accommodation-title"
        />

        <div className="mt-14 space-y-12">
          {groups.map((group, groupIndex) => (
            <Reveal key={group.key} delay={groupIndex * 80}>
              <div className="flex items-center gap-3">
                <group.icon className="size-4 shrink-0 text-champagne" />
                <EditableText
                  id={`accommodation-${group.key}-label`}
                  value={group.label}
                  className="overline"
                />
              </div>
              <ul className="mt-5 space-y-px overflow-hidden rounded-sm border border-steel/40">
                {group.items.map((item, index) => (
                  <li
                    key={item.name}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 bg-deep/40 px-4 py-4 backdrop-blur-sm"
                  >
                    <div className="min-w-0">
                      <EditableText
                        id={`accommodation-${group.key}-${index}-name`}
                        value={item.name}
                        as="p"
                        className="font-display text-lg text-ivory"
                      />
                      <EditableText
                        id={`accommodation-${group.key}-${index}-detail`}
                        value={item.detail}
                        as="p"
                        multiline
                        className="mt-1 text-xs leading-relaxed text-cloud/65"
                      />
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-champagne/80">
                      {item.distance}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

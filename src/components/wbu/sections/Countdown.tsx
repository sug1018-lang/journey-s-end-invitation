import { useEffect, useState } from "react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { EditableText } from "../EditableText";
import { Reveal } from "../primitives";

const { countdown, couple } = worldBetweenUsConfig;

function remaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const target = new Date(couple.dateISO).getTime();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(remaining(target));
    const timer = window.setInterval(() => setTime(remaining(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const cells = [
    { value: time.days, label: countdown.labels.days },
    { value: time.hours, label: countdown.labels.hours },
    { value: time.minutes, label: countdown.labels.minutes },
    { value: time.seconds, label: countdown.labels.seconds },
  ];

  return (
    <section id="countdown" className="relative py-20">
      <div className="section-shell">
        <Reveal className="text-center">
          <EditableText
            id="countdown-title"
            value={countdown.title}
            as="h2"
            className="font-display text-[clamp(1.7rem,6.5vw,2.4rem)] font-light text-ivory"
          />
          <EditableText
            id="countdown-subtitle"
            value={countdown.subtitle}
            as="p"
            className="mt-3 text-[0.7rem] uppercase tracking-[0.28em] text-cloud/60"
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 grid grid-cols-4 gap-2 rounded-md border border-champagne/25 bg-deep/50 p-4 shadow-[var(--shadow-soft)] backdrop-blur-md sm:gap-4 sm:p-6">
            {cells.map((cell) => (
              <div key={cell.label} className="min-w-0 text-center">
                <div className="font-display text-[clamp(1.7rem,9vw,2.8rem)] font-light leading-none tabular-nums text-ivory">
                  {String(cell.value).padStart(2, "0")}
                </div>
                <div className="mt-2 truncate text-[9px] uppercase tracking-[0.2em] text-champagne/80">
                  {cell.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

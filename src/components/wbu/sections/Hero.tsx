import { ChevronDown } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { EditableImage } from "../EditableImage";
import { EditableText } from "../EditableText";

const { couple, hero } = worldBetweenUsConfig;

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      {hero.backgroundVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={hero.backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={hero.backgroundImage}
        />
      ) : (
        <EditableImage
          id="hero-background"
          src={hero.backgroundImage}
          alt={`${couple.partnerOne} & ${couple.partnerTwo} — ${couple.location}`}
          className="absolute inset-0 h-full w-full"
          priority
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(9,20,38,.92)_2%,rgba(9,20,38,.35)_45%,rgba(9,20,38,.78)_100%)]" />

      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-24 pt-24 text-center">
        <EditableText id="hero-overline" value={hero.overline} className="overline wbu-reveal" />

        <h1 className="mt-8 flex flex-col items-center gap-1 font-display text-ivory">
          <EditableText
            id="couple-partner-one"
            value={couple.partnerOne}
            className="wbu-reveal text-[clamp(3rem,17vw,5.5rem)] font-light leading-[0.95] tracking-[0.02em]"
          />
          <EditableText
            id="couple-amp"
            value="&"
            className="wbu-reveal text-[clamp(1.4rem,6vw,2rem)] font-light text-champagne"
          />
          <EditableText
            id="couple-partner-two"
            value={couple.partnerTwo}
            className="wbu-reveal text-[clamp(3rem,17vw,5.5rem)] font-light leading-[0.95] tracking-[0.02em]"
          />
        </h1>

        <div className="mx-auto mt-8 h-px w-28 bg-[linear-gradient(90deg,transparent,var(--champagne),transparent)]" />

        <div className="mt-6 space-y-2 text-[0.78rem] uppercase tracking-[0.3em] text-cloud/85">
          <EditableText id="couple-date" value={couple.date} as="p" />
          <EditableText id="couple-location" value={couple.location} as="p" />
        </div>

        <EditableText
          id="couple-tagline"
          value={couple.tagline}
          as="p"
          multiline
          className="mt-10 max-w-sm font-display text-lg font-light italic leading-relaxed text-ivory/90"
        />

        <div className="absolute bottom-28 flex flex-col items-center gap-2 text-cloud/60">
          <span className="text-[10px] uppercase tracking-[0.3em]">{hero.scrollHint}</span>
          <ChevronDown className="size-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

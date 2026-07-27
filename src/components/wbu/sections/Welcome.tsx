import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { EditableText } from "../EditableText";
import { Reveal } from "../primitives";

const { welcome } = worldBetweenUsConfig;

export function Welcome() {
  return (
    <section id="welcome" className="relative py-24">
      <div className="section-shell text-center">
        <Reveal>
          <EditableText
            id="welcome-title"
            value={welcome.title}
            as="h2"
            className="font-display text-[clamp(1.9rem,7.5vw,2.8rem)] font-light leading-tight text-ivory"
          />
          <div className="mx-auto mt-6 h-px w-20 bg-[linear-gradient(90deg,transparent,var(--champagne),transparent)]" />
          <EditableText
            id="welcome-body"
            value={welcome.body}
            as="p"
            multiline
            className="mt-8 text-[0.95rem] leading-[1.9] text-cloud/80"
          />
          <EditableText
            id="welcome-signature"
            value={welcome.signature}
            as="p"
            className="mt-8 font-display text-xl italic text-champagne"
          />
        </Reveal>
      </div>
    </section>
  );
}

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { EditableImage } from "../EditableImage";
import { EditableText } from "../EditableText";
import { Reveal } from "../primitives";

const { finalMessage } = worldBetweenUsConfig;

export function FinalMessage() {
  return (
    <section id="final" className="relative min-h-[92svh] w-full overflow-hidden">
      <EditableImage
        id="final-image"
        src={finalMessage.image}
        alt="Le couple, le soir du mariage"
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(9,20,38,.95),rgba(9,20,38,.45)_50%,rgba(9,20,38,.85))]" />

      <div className="relative flex min-h-[92svh] flex-col items-center justify-center px-8 pb-32 text-center">
        <Reveal>
          <EditableText
            id="final-quote"
            value={finalMessage.quote}
            as="p"
            multiline
            className="max-w-md font-display text-[clamp(1.7rem,7.5vw,2.6rem)] font-light italic leading-[1.3] text-ivory"
          />
          <div className="mx-auto mt-8 h-px w-20 bg-[linear-gradient(90deg,transparent,var(--champagne),transparent)]" />
          <EditableText
            id="final-subtext"
            value={finalMessage.subtext}
            as="p"
            className="mt-8 text-[0.72rem] uppercase tracking-[0.3em] text-cloud/75"
          />
          <EditableText
            id="final-signature"
            value={finalMessage.signature}
            as="p"
            className="mt-4 font-display text-lg text-champagne"
          />
        </Reveal>
      </div>
    </section>
  );
}

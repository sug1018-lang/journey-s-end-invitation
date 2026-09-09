import { flagEmoji, type Country } from "@/lib/countries";
import { cn } from "@/lib/utils";

export type IntroCountriesProps = {
  one?: Country;
  two?: Country;
  /** Countries appear with the origins and merge on the tagline beat. */
  phase: "hidden" | "origins" | "union";
};

/**
 * Cinematic country overlay laid over the existing globe intro.
 * Both countries get identical treatment — neither is "primary".
 * Renders nothing when no country is configured (generic intro preserved).
 */
export function IntroCountries({ one, two, phase }: IntroCountriesProps) {
  if (!one && !two) return null;
  const visible = phase !== "hidden";
  const united = phase === "union" && Boolean(one && two);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[13%] z-[105] px-6"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1200ms cubic-bezier(.22,.61,.36,1)",
      }}
      aria-hidden="true"
    >
      <div
        className="mx-auto flex max-w-md items-center justify-center"
        style={{
          gap: united ? "0.75rem" : "2.25rem",
          transition: "gap 1600ms cubic-bezier(.22,.61,.36,1)",
        }}
      >
        <CountryCard country={one} side="left" visible={visible} />
        {one && two ? (
          <span
            className="font-display text-[clamp(1rem,4vw,1.4rem)] font-light text-champagne"
            style={{
              opacity: united ? 1 : 0.35,
              transform: `scale(${united ? 1.15 : 0.9})`,
              transition: "opacity 1200ms ease, transform 1200ms ease",
            }}
          >
            &
          </span>
        ) : null}
        <CountryCard country={two} side="right" visible={visible} delay={420} />
      </div>
    </div>
  );
}

function CountryCard({
  country,
  side,
  visible,
  delay = 0,
}: {
  country?: Country;
  side: "left" | "right";
  visible: boolean;
  delay?: number;
}) {
  if (!country) return null;
  const offset = side === "left" ? -18 : 18;
  return (
    <div
      className={cn("flex min-w-0 flex-col items-center gap-2 text-center")}
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate3d(${visible ? 0 : offset}px, 0, 0)`,
        transition: `opacity 1200ms ${delay}ms ease, transform 1400ms ${delay}ms cubic-bezier(.22,.61,.36,1)`,
      }}
    >
      <span
        className="text-[clamp(1.7rem,8vw,2.6rem)] leading-none"
        style={{ filter: "drop-shadow(0 6px 18px rgba(9,20,38,.85))" }}
      >
        {flagEmoji(country.code)}
      </span>
      <span
        className="max-w-[9.5rem] truncate text-[10px] uppercase tracking-[0.28em] text-ivory/85"
        style={{ textShadow: "0 1px 14px rgba(9,20,38,.95)" }}
      >
        {country.name}
      </span>
      <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--champagne),transparent)]" />
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { worldBetweenUsConfig, type GeoPoint } from "@/config/worldBetweenUs";
import { cn } from "@/lib/utils";

export type WorldIntroState =
  | "idle"
  | "earthVisible"
  | "showingOrigins"
  | "drawingRoutes"
  | "showingTagline"
  | "zoomingToDestination"
  | "transitioning"
  | "completed";

export const INTRO_SEEN_KEY = "world-between-us-intro-seen";

const { intro, hero } = worldBetweenUsConfig;

/** Timeline in ms, keyed by state. */
const TIMELINE: { state: WorldIntroState; at: number }[] = [
  { state: "earthVisible", at: 250 },
  { state: "showingOrigins", at: 2200 },
  { state: "drawingRoutes", at: 3600 },
  { state: "showingTagline", at: 6600 },
  { state: "zoomingToDestination", at: 8600 },
  { state: "transitioning", at: 11600 },
  { state: "completed", at: 13200 },
];

const REDUCED_TIMELINE: { state: WorldIntroState; at: number }[] = [
  { state: "earthVisible", at: 100 },
  { state: "showingOrigins", at: 500 },
  { state: "drawingRoutes", at: 900 },
  { state: "showingTagline", at: 1400 },
  { state: "zoomingToDestination", at: 2300 },
  { state: "transitioning", at: 2900 },
  { state: "completed", at: 3400 },
];

type View = { lon: number; lat: number; zoom: number };

/** Container shows 90/zoom degrees of longitude and latitude around the center. */
function project(point: GeoPoint, view: View) {
  const span = 90 / view.zoom;
  let dLon = point.lng - view.lon;
  while (dLon > 180) dLon -= 360;
  while (dLon < -180) dLon += 360;
  const dLat = point.lat - view.lat;
  return {
    x: 50 + (dLon / span) * 100,
    y: 50 - (dLat / span) * 100,
    visible: Math.abs(dLon) < span * 0.62 && Math.abs(dLat) < span * 0.62,
  };
}

function backgroundPosition(view: View) {
  const kx = 4 * view.zoom;
  const ky = 2 * view.zoom;
  const u = (view.lon + 180) / 360;
  const v = (90 - view.lat) / 180;
  const px = ((0.5 - u * kx) / (1 - kx)) * 100;
  const py = ((0.5 - v * ky) / (1 - ky)) * 100;
  return { px, py, sizeX: kx * 100, sizeY: ky * 100 };
}

function midLongitude(a: number, b: number) {
  let diff = b - a;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return a + diff / 2;
}

export function WorldBetweenUsIntro({ onFinish }: { onFinish: () => void }) {
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const timeline = reduced ? REDUCED_TIMELINE : TIMELINE;

  const [state, setState] = useState<WorldIntroState>("idle");
  const [showSkip, setShowSkip] = useState(false);
  const [view, setView] = useState<View>({
    lon: midLongitude(intro.originOne.lng, intro.originTwo.lng) - 55,
    lat: (intro.originOne.lat + intro.originTwo.lat) / 2 + 6,
    zoom: 1,
  });
  const viewRef = useRef(view);
  const targetRef = useRef<View>({ ...view });
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, "true");
    } catch {
      /* private mode */
    }
    onFinish();
  }, [onFinish]);

  // State machine timers
  useEffect(() => {
    const timers = timeline.map((step) =>
      window.setTimeout(() => {
        setState(step.state);
        if (step.state === "completed") finish();
      }, step.at),
    );
    const skipTimer = window.setTimeout(() => setShowSkip(true), 1500);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(skipTimer);
    };
  }, [timeline, finish]);

  // Camera targets per state
  useEffect(() => {
    const mid = {
      lon: midLongitude(intro.originOne.lng, intro.originTwo.lng),
      lat: (intro.originOne.lat + intro.originTwo.lat) / 2,
    };
    switch (state) {
      case "showingOrigins":
      case "drawingRoutes":
      case "showingTagline":
        targetRef.current = { lon: mid.lon, lat: mid.lat, zoom: 1 };
        break;
      case "zoomingToDestination":
        targetRef.current = { lon: intro.destination.lng, lat: intro.destination.lat, zoom: 7 };
        break;
      case "transitioning":
      case "completed":
        targetRef.current = { lon: intro.destination.lng, lat: intro.destination.lat, zoom: 30 };
        break;
      default:
        break;
    }
  }, [state]);

  // Smooth camera + idle rotation
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const current = viewRef.current;
      const target = targetRef.current;

      if (state === "idle" || state === "earthVisible") {
        target.lon += dt * 2.2; // slow, cinematic rotation
      }
      const ease = 1 - Math.exp(-dt * (state === "zoomingToDestination" ? 0.85 : 1.4));
      let dLon = target.lon - current.lon;
      while (dLon > 180) dLon -= 360;
      while (dLon < -180) dLon += 360;
      const next: View = {
        lon: current.lon + dLon * ease,
        lat: current.lat + (target.lat - current.lat) * ease,
        zoom: current.zoom * Math.pow(target.zoom / current.zoom, ease),
      };
      viewRef.current = next;
      setView(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  // Escape also skips
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  const bg = backgroundPosition(view);
  const p1 = project(intro.originOne, view);
  const p2 = project(intro.originTwo, view);
  const pd = project(intro.destination, view);

  const showOrigins = ["showingOrigins", "drawingRoutes", "showingTagline", "zoomingToDestination"].includes(state);
  const showRoutes = ["drawingRoutes", "showingTagline", "zoomingToDestination"].includes(state);
  const zooming = state === "zoomingToDestination" || state === "transitioning" || state === "completed";
  const transitioning = state === "transitioning" || state === "completed";

  const arc = (a: typeof p1, b: typeof pd) => {
    const cx = (a.x + b.x) / 2 + (a.y - b.y) * 0.22;
    const cy = (a.y + b.y) / 2 - Math.abs(a.x - b.x) * 0.28 - 6;
    return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-ink"
      role="dialog"
      aria-label="Introduction"
      style={{ opacity: state === "completed" ? 0 : 1, transition: "opacity 700ms ease" }}
    >
      {/* Starfield */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 22%, rgba(244,240,232,.9), transparent), radial-gradient(1px 1px at 68% 14%, rgba(216,221,229,.7), transparent), radial-gradient(1.4px 1.4px at 82% 62%, rgba(244,240,232,.8), transparent), radial-gradient(1px 1px at 34% 78%, rgba(216,221,229,.6), transparent), radial-gradient(1px 1px at 52% 40%, rgba(244,240,232,.5), transparent), radial-gradient(1px 1px at 92% 32%, rgba(244,240,232,.55), transparent)",
          transform: `scale(${1 + view.zoom * 0.02})`,
        }}
      />

      {/* Globe */}
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[min(82vw,30rem)]"
        style={{
          transform: `translate3d(-50%, -50%, 0) scale(${zooming ? 1 + Math.min(view.zoom, 30) * 0.09 : 1})`,
          opacity: state === "idle" ? 0 : transitioning ? 0.25 : 1,
          filter: transitioning ? "blur(18px)" : "none",
          transition: "opacity 1400ms ease, filter 1200ms ease",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: `url(${intro.earthTexture})`,
            backgroundSize: `${bg.sizeX}% ${bg.sizeY}%`,
            backgroundPosition: `${bg.px}% ${bg.py}%`,
            boxShadow:
              "inset -28px -20px 70px 12px rgba(9,20,38,.92), inset 22px 18px 60px -20px rgba(199,166,106,.18), 0 0 90px 10px rgba(76,130,190,.28), 0 0 190px 40px rgba(29,57,92,.35)",
          }}
        />
        {/* Atmosphere */}
        <div
          className="pointer-events-none absolute -inset-[6%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 62%, rgba(120,180,235,.20) 72%, rgba(120,180,235,.05) 82%, transparent 92%)",
          }}
        />
        {/* Limb shading */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 34% 30%, rgba(255,255,255,.16), transparent 42%), radial-gradient(circle at 50% 50%, transparent 55%, rgba(9,20,38,.78) 92%)",
          }}
        />

        {/* Routes + markers */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          style={{ clipPath: "circle(50% at 50% 50%)" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wbu-route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C7A66A" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#F4F0E8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#D1B07A" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {showRoutes ? (
            <>
              <path
                d={arc(p1, pd)}
                fill="none"
                stroke="url(#wbu-route)"
                strokeWidth={0.7}
                strokeLinecap="round"
                className="wbu-route-line"
              />
              <path
                d={arc(p2, pd)}
                fill="none"
                stroke="url(#wbu-route)"
                strokeWidth={0.7}
                strokeLinecap="round"
                className="wbu-route-line wbu-route-line--delayed"
              />
            </>
          ) : null}
        </svg>

        {showOrigins ? (
          <>
            <Marker point={p1} label={intro.originOne.label} align="left" />
            <Marker point={p2} label={intro.originTwo.label} align="right" delay={450} />
          </>
        ) : null}
        {showRoutes ? (
          <Marker
            point={pd}
            label={
              Math.abs(intro.destination.lat - intro.originOne.lat) < 0.5 &&
              Math.abs(intro.destination.lng - intro.originOne.lng) < 0.5
                ? ""
                : intro.destination.label
            }
            align="center"
            destination
            delay={900}
          />
        ) : null}
      </div>

      {/* Tagline */}
      <p
        className="absolute inset-x-0 bottom-[22%] px-8 text-center font-display text-[clamp(1.6rem,7vw,2.6rem)] font-light tracking-[0.16em] text-ivory"
        style={{
          opacity: state === "showingTagline" || state === "zoomingToDestination" ? 1 : 0,
          transform: `translate3d(0, ${state === "showingTagline" || state === "zoomingToDestination" ? "0" : "16px"}, 0)`,
          transition: "opacity 1400ms ease, transform 1400ms ease",
          textShadow: "0 2px 30px rgba(9,20,38,.9)",
        }}
      >
        {intro.tagline}
      </p>

      {/* Continuous hand-off into the hero image */}
      <div
        className="absolute inset-0"
        style={{
          opacity: transitioning ? 1 : 0,
          transition: "opacity 1500ms cubic-bezier(.22,.61,.36,1)",
          pointerEvents: "none",
        }}
      >
        <img
          src={hero.backgroundImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{
            transform: `scale(${transitioning ? 1.02 : 1.6})`,
            transition: "transform 2200ms cubic-bezier(.22,.61,.36,1)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,20,38,.85),rgba(9,20,38,.25),rgba(9,20,38,.7))]" />
      </div>

      {showSkip && state !== "completed" ? (
        <button
          type="button"
          onClick={finish}
          className="absolute bottom-8 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-cloud/25 bg-ink/40 px-5 py-2 text-[11px] uppercase tracking-[0.24em] text-cloud/80 backdrop-blur-md transition hover:border-champagne hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          {intro.skipLabel}
        </button>
      ) : null}
    </div>
  );
}

function Marker({
  point,
  label,
  align,
  destination = false,
  delay = 0,
}: {
  point: { x: number; y: number; visible: boolean };
  label: string;
  align: "left" | "right" | "center";
  destination?: boolean;
  delay?: number;
}) {
  if (!point.visible) return null;
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        transform: "translate3d(-50%, -50%, 0)",
        animation: `wbu-marker-in 900ms ${delay}ms cubic-bezier(.22,.61,.36,1) both`,
      }}
    >
      <span
        className={cn(
          "block rounded-full",
          destination ? "size-2.5 bg-ivory" : "size-2 bg-champagne",
        )}
        style={{
          boxShadow: destination
            ? "0 0 0 4px rgba(244,240,232,.18), 0 0 26px 8px rgba(244,240,232,.55)"
            : "0 0 0 4px rgba(199,166,106,.16), 0 0 22px 6px rgba(199,166,106,.5)",
        }}
      />
      <span className="absolute size-2 animate-ping rounded-full bg-champagne/50" style={{ left: 0, top: 0 }} />
      <span
        className={cn(
          "absolute top-4 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-ivory/85",
          align === "left" && "left-0",
          align === "right" && "right-0",
          align === "center" && "left-1/2 -translate-x-1/2",
        )}
        style={{ textShadow: "0 1px 12px rgba(9,20,38,.95)" }}
      >
        {label}
      </span>
    </div>
  );
}

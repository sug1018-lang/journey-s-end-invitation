import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { AdminBar } from "@/components/wbu/AdminBar";
import { MobileNav } from "@/components/wbu/MobileNav";
import { EditModeProvider } from "@/components/wbu/edit-mode";
import { INTRO_SEEN_KEY, WorldBetweenUsIntro } from "@/components/wbu/WorldBetweenUsIntro";
import { Hero } from "@/components/wbu/sections/Hero";
import { Welcome } from "@/components/wbu/sections/Welcome";
import { Countdown } from "@/components/wbu/sections/Countdown";
import { Journey } from "@/components/wbu/sections/Journey";
import { Schedule } from "@/components/wbu/sections/Schedule";
import { Venue } from "@/components/wbu/sections/Venue";
import { Accommodation } from "@/components/wbu/sections/Accommodation";
import { Gallery } from "@/components/wbu/sections/Gallery";
import { Rsvp } from "@/components/wbu/sections/Rsvp";
import { Faq } from "@/components/wbu/sections/Faq";
import { FinalMessage } from "@/components/wbu/sections/FinalMessage";

const { couple, sections, intro } = worldBetweenUsConfig;

const title = `${couple.partnerOne} & ${couple.partnerTwo} — The World Between Us`;
const description = `${couple.date} · ${couple.location}. ${couple.tagline}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldBetweenUsPage,
});

function WorldBetweenUsPage() {
  const [introDone, setIntroDone] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    let seen = true;
    try {
      seen = window.sessionStorage.getItem(INTRO_SEEN_KEY) === "true";
    } catch {
      seen = true;
    }
    setIntroDone(seen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  const replay = () => {
    try {
      window.sessionStorage.removeItem(INTRO_SEEN_KEY);
    } catch {
      /* private mode */
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    setReplayKey((key) => key + 1);
    setIntroDone(false);
  };

  return (
    <EditModeProvider>
      {!introDone ? (
        <WorldBetweenUsIntro key={replayKey} onFinish={() => setIntroDone(true)} />
      ) : null}

      <main className="relative pb-24">
        {sections.hero ? <Hero /> : null}
        {sections.welcome ? <Welcome /> : null}
        {sections.countdown ? <Countdown /> : null}
        {sections.journey ? <Journey /> : null}
        {sections.schedule ? <Schedule /> : null}
        {sections.venue ? <Venue /> : null}
        {sections.accommodation ? <Accommodation /> : null}
        {sections.gallery ? <Gallery /> : null}
        {sections.rsvp ? <Rsvp /> : null}
        {sections.faq ? <Faq /> : null}
        {sections.finalMessage ? <FinalMessage /> : null}

        <div className="section-shell pb-10 pt-4 text-center">
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-2 rounded-full border border-cloud/20 px-5 py-2 text-[10px] uppercase tracking-[0.24em] text-cloud/60 transition hover:border-champagne hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <Globe2 className="size-3.5" />
            {intro.replayLabel}
          </button>
        </div>
      </main>

      <AdminBar />
      <MobileNav />
    </EditModeProvider>
  );
}

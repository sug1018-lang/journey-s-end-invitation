import heroImage from "@/assets/world-between-us/hero.jpg";
import venueImage from "@/assets/world-between-us/venue.jpg";
import finalImage from "@/assets/world-between-us/final.jpg";
import story01 from "@/assets/world-between-us/story-01.jpg";
import story02 from "@/assets/world-between-us/story-02.jpg";
import story03 from "@/assets/world-between-us/story-03.jpg";
import story04 from "@/assets/world-between-us/story-04.jpg";
import gallery01 from "@/assets/world-between-us/gallery-01.jpg";
import gallery02 from "@/assets/world-between-us/gallery-02.jpg";
import gallery03 from "@/assets/world-between-us/gallery-03.jpg";
import gallery04 from "@/assets/world-between-us/gallery-04.jpg";
import earthTexture from "@/assets/world-between-us/earth-texture.jpg";

export type GeoPoint = {
  label: string;
  lat: number;
  lng: number;
};

export type SectionKey =
  | "hero"
  | "welcome"
  | "countdown"
  | "journey"
  | "schedule"
  | "venue"
  | "accommodation"
  | "gallery"
  | "rsvp"
  | "faq"
  | "finalMessage";

/**
 * Single source of truth for the "The World Between Us" template.
 * Every text, image, date and coordinate used by the invitation lives here.
 */
export const worldBetweenUsConfig = {
  meta: {
    templateName: "The World Between Us",
    locale: "en" as const,
  },

  couple: {
    partnerOne: "Emma",
    partnerTwo: "Lucas",
    date: "21 September 2027",
    /** ISO date used by the countdown — the only place the target date is defined. */
    dateISO: "2027-09-21T16:00:00+02:00",
    location: "Lausanne, Switzerland",
    tagline: "No matter the distance, every road led us here.",
  },

  intro: {
    earthTexture,
    tagline: "Two worlds. One story.",
    skipLabel: "Passer l'introduction",
    replayLabel: "Revoir l'introduction",
    originOne: { label: "Lausanne, Switzerland", lat: 46.5197, lng: 6.6323 } as GeoPoint,
    originTwo: { label: "Jaffna, Sri Lanka", lat: 9.6615, lng: 80.0255 } as GeoPoint,
    destination: { label: "Lausanne, Switzerland", lat: 46.5197, lng: 6.6323 } as GeoPoint,
  },

  hero: {
    backgroundImage: heroImage,
    backgroundVideo: "" as string,
    overline: "The World Between Us",
    scrollHint: "Scroll",
  },

  welcome: {
    title: "Two paths, one destination",
    body: "We were born four thousand miles apart, on two different shores, under two different skies. Every train, every flight, every detour quietly carried us toward the same evening by the lake. We would be honoured to have you there when the two roads finally become one.",
    signature: "Emma & Lucas",
  },

  countdown: {
    title: "Until Our Paths Meet",
    subtitle: "Le compte à rebours vers le grand jour",
    labels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
  },

  journey: {
    title: "Our Journey",
    subtitle: "Notre Voyage",
    intro: "Five places. One story that kept moving until it found its home.",
    items: [
      {
        id: "journey-birthplace",
        title: "Where It Began",
        date: "1994 — 1996",
        place: "Jaffna, Sri Lanka · Lausanne, Switzerland",
        image: story02,
        text: "Two children, two coastlines, two languages. Neither of them knew the other existed, and yet both were already walking in the same direction.",
      },
      {
        id: "journey-meeting",
        title: "First Meeting",
        date: "April 2022",
        place: "Rue de Bourg, Lausanne",
        image: story01,
        text: "A cancelled train, a crowded café, one free chair. Three hours later the coffee was cold and neither of them had noticed.",
      },
      {
        id: "journey-trip",
        title: "Our First Trip",
        date: "December 2023",
        place: "Northern Province, Sri Lanka",
        image: story04,
        text: "Emma met the ocean Lucas grew up with. That week, the distance between the two worlds became a shared address.",
      },
      {
        id: "journey-proposal",
        title: "The Proposal",
        date: "August 2026",
        place: "Rochers-de-Naye, Switzerland",
        image: story03,
        text: "Above the clouds, before sunrise, with the lake still asleep below. One question, one word, and every road finally pointed to the same place.",
      },
    ],
  },

  schedule: {
    title: "The Itinerary",
    subtitle: "Le programme du jour",
    items: [
      { time: "15:30", title: "Guest Arrival", description: "Welcome drinks on the lake terrace.", icon: "arrival" },
      { time: "16:00", title: "Wedding Ceremony", description: "In the palace gardens, facing the water.", icon: "ceremony" },
      { time: "17:30", title: "Cocktail", description: "Champagne, canapés and golden hour by Lake Geneva.", icon: "cocktail" },
      { time: "19:30", title: "Dinner", description: "A seated dinner in the Salle Sandoz.", icon: "dinner" },
      { time: "22:00", title: "Celebration", description: "Dancing until the last light on the lake.", icon: "party" },
    ],
  },

  venue: {
    title: "The Place We Chose",
    name: "Beau-Rivage Palace",
    address: "Place du Port 17-19, 1006 Lausanne, Switzerland",
    note: "Valet parking is available at the main entrance from 15:00.",
    image: venueImage,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Beau-Rivage+Palace+Lausanne",
    mapsLabel: "Open in Google Maps",
  },

  accommodation: {
    title: "Stay & Travel",
    subtitle: "Hébergement & Transport",
    stays: [
      { name: "Beau-Rivage Palace", detail: "On site — special rate under “Emma & Lucas”.", distance: "0 min" },
      { name: "Hôtel Angleterre & Résidence", detail: "Lakeside, quiet and classic.", distance: "4 min walk" },
      { name: "Hôtel des Voyageurs", detail: "In the old town, a warm mid-range option.", distance: "10 min by car" },
    ],
    travel: [
      { name: "Geneva Airport (GVA)", detail: "Direct train to Lausanne every 30 minutes.", distance: "45 min" },
      { name: "Lausanne Railway Station", detail: "Taxis and metro M2 to Ouchy.", distance: "8 min by car" },
      { name: "Shuttle service", detail: "A shuttle runs from the station at 14:45 and 15:15.", distance: "On request" },
    ],
  },

  gallery: {
    title: "Fragments",
    subtitle: "Des morceaux du chemin",
    items: [
      { id: "g1", src: gallery01, alt: "The couple walking along a misty lakeside promenade" },
      { id: "g2", src: gallery02, alt: "The couple in an alpine meadow at golden hour" },
      { id: "g3", src: gallery03, alt: "Two hands with rings resting on a vintage travel map" },
      { id: "g4", src: gallery04, alt: "Sunrise seen from an airplane window above the clouds" },
      { id: "g5", src: story01, alt: "The couple laughing in a European café" },
      { id: "g6", src: story04, alt: "An elegant wedding table set at dusk by the lake" },
    ],
  },

  rsvp: {
    title: "Confirm Your Journey",
    subtitle: "Confirmez votre présence avant le 1er juillet 2027",
    submitLabel: "Confirm My Journey",
    successTitle: "Your seat is reserved",
    successBody: "Thank you — we have received your answer. We cannot wait to share this day with you.",
    mealOptions: ["Menu classique", "Menu végétarien", "Menu sans gluten", "Menu enfant"],
  },

  faq: {
    title: "Good to know",
    items: [
      { q: "What is the dress code?", a: "Formal — long dresses and dark suits. The ceremony takes place on grass, so avoid thin heels." },
      { q: "Can I bring my children?", a: "Children are welcome. Please indicate them in the RSVP so we can plan the children's menu." },
      { q: "Is there a gift registry?", a: "Your presence is the gift. If you insist, a honeymoon fund will be available at the reception." },
    ],
  },

  finalMessage: {
    image: finalImage,
    quote: "No matter where we began, every road led us here.",
    subtext: "Deux mondes, une histoire.",
    signature: "Emma & Lucas — 21.09.2027",
  },

  nav: [
    { id: "hero", label: "Accueil", icon: "home" },
    { id: "journey", label: "Voyage", icon: "route" },
    { id: "schedule", label: "Programme", icon: "calendar" },
    { id: "gallery", label: "Galerie", icon: "images" },
    { id: "rsvp", label: "RSVP", icon: "ticket" },
  ],

  /** Toggle any block on or off. */
  sections: {
    hero: true,
    welcome: true,
    countdown: true,
    journey: true,
    schedule: true,
    venue: true,
    accommodation: true,
    gallery: true,
    rsvp: true,
    faq: true,
    finalMessage: true,
  } satisfies Record<SectionKey, boolean>,
};

export type WorldBetweenUsConfig = typeof worldBetweenUsConfig;

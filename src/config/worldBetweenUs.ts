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

import type { LocationData, LocationMap } from "@/lib/locations";

export type GeoPoint = { label: string; lat: number; lng: number };

export type SectionKey =
  | "hero"
  | "welcome"
  | "countdown"
  | "journey"
  | "schedule"
  | "places"
  | "accommodation"
  | "gallery"
  | "rsvp"
  | "faq"
  | "finalMessage";

export type JourneyItem = {
  id: string;
  title: string;
  date: string;
  /** Reference to a location — never a duplicated address. */
  locationId?: string;
  /** Optional free text used when no location is linked. */
  place?: string;
  image: string;
  text: string;
  showMapLink?: boolean;
};

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: string;
  locationId?: string;
  dressCode?: string;
  note?: string;
  transport?: string;
  parking?: string;
  /** Ask guests about this event in the RSVP form. */
  rsvp?: boolean;
};

/**
 * Single source of truth for the "The World Between Us" template.
 * Every place lives once in `locations`; sections reference it by id.
 */
const locations: LocationMap = {
  "origin-one": {
    id: "origin-one",
    label: "Lausanne, Switzerland",
    city: "Lausanne",
    country: "Switzerland",
    countryCode: "CH",
    latitude: 46.5197,
    longitude: 6.6323,
    enabled: true,
  },
  "origin-two": {
    id: "origin-two",
    label: "Jaffna, Sri Lanka",
    city: "Jaffna",
    country: "Sri Lanka",
    countryCode: "LK",
    latitude: 9.6615,
    longitude: 80.0255,
    enabled: true,
  },
  "first-meeting": {
    id: "first-meeting",
    label: "Rue de Bourg, Lausanne",
    city: "Lausanne",
    country: "Switzerland",
    countryCode: "CH",
    latitude: 46.5205,
    longitude: 6.6339,
    optional: true,
    enabled: true,
  },
  ceremony: {
    id: "ceremony",
    label: "Beau-Rivage Palace",
    venueName: "Beau-Rivage Palace",
    address: "Place du Port 17-19",
    postalCode: "1006",
    city: "Lausanne",
    country: "Switzerland",
    countryCode: "CH",
    latitude: 46.5079,
    longitude: 6.6288,
    websiteUrl: "https://www.brp.ch",
    notes: "La cérémonie a lieu dans les jardins du palace, face au lac.",
    parking: "Voiturier disponible à l'entrée principale dès 15:00.",
    transport: "Métro M2 jusqu'à Ouchy, puis 5 minutes à pied.",
    imageId: "location-ceremony-image",
    image: venueImage,
    imageAlt: "Façade du Beau-Rivage Palace à l'heure dorée",
    enabled: true,
  },
  reception: {
    id: "reception",
    label: "Salle Sandoz",
    venueName: "Salle Sandoz — Beau-Rivage Palace",
    address: "Place du Port 17-19",
    postalCode: "1006",
    city: "Lausanne",
    country: "Switzerland",
    countryCode: "CH",
    latitude: 46.5077,
    longitude: 6.629,
    notes: "Dîner assis puis soirée dansante jusqu'au bout de la nuit.",
    imageId: "location-reception-image",
    image: finalImage,
    imageAlt: "Table de mariage dressée au crépuscule",
    optional: true,
    enabled: true,
  },
  "hotel-main": {
    id: "hotel-main",
    label: "Hôtel Angleterre & Résidence",
    venueName: "Hôtel Angleterre & Résidence",
    address: "Place du Port 11",
    postalCode: "1006",
    city: "Lausanne",
    country: "Switzerland",
    countryCode: "CH",
    latitude: 46.5073,
    longitude: 6.6262,
    notes: "Tarif préférentiel sous la mention « Emma & Lucas ».",
    imageId: "location-hotel-image",
    image: story03,
    imageAlt: "Hôtel élégant au bord du lac",
    optional: true,
    enabled: true,
  },
  "origin-story-one": {
    id: "origin-story-one",
    label: "Jaffna, Sri Lanka",
    city: "Jaffna",
    country: "Sri Lanka",
    countryCode: "LK",
    latitude: 9.6615,
    longitude: 80.0255,
    optional: true,
    enabled: true,
  },
  proposal: {
    id: "proposal",
    label: "Rochers-de-Naye",
    city: "Montreux",
    country: "Switzerland",
    countryCode: "CH",
    latitude: 46.4319,
    longitude: 6.9781,
    optional: true,
    enabled: true,
  },
  "first-trip": {
    id: "first-trip",
    label: "Northern Province, Sri Lanka",
    city: "Jaffna",
    country: "Sri Lanka",
    countryCode: "LK",
    latitude: 9.7,
    longitude: 80.05,
    optional: true,
    enabled: true,
  },
};

export const worldBetweenUsConfig = {
  meta: {
    templateName: "The World Between Us",
    locale: "en" as const,
  },

  couple: {
    /** `countryCode` = ISO 3166-1 alpha-2 (see src/lib/countries.ts). Empty = generic intro. */
    partnerOne: { name: "Emma", originLocationId: "origin-one", countryCode: "CH" },
    partnerTwo: { name: "Lucas", originLocationId: "origin-two", countryCode: "LK" },
    date: "21 September 2027",
    /** ISO date used by the countdown — the only place the target date is defined. */
    dateISO: "2027-09-21T16:00:00+02:00",
    /** Displayed location = the ceremony location, never a duplicated string. */
    locationId: "ceremony",
    tagline: "No matter the distance, every road led us here.",
  },

  locations,

  intro: {
    earthTexture,
    tagline: "Two worlds. One story.",
    sameOriginTagline: "Two paths began in the same place.",
    skipLabel: "Passer l'introduction",
    replayLabel: "Revoir l'introduction",
    originOneLocationId: "origin-one",
    originTwoLocationId: "origin-two",
    destinationLocationId: "ceremony",
    showLabels: true,
    showRoutes: true,
    enableDestinationZoom: true,
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
        title: "Where Our Stories Began",
        date: "1994 — 1996",
        locationId: "origin-story-one",
        image: story02,
        showMapLink: false,
        text: "Two children, two coastlines, two languages. Neither of them knew the other existed, and yet both were already walking in the same direction.",
      },
      {
        id: "journey-meeting",
        title: "First Meeting",
        date: "April 2022",
        locationId: "first-meeting",
        image: story01,
        showMapLink: true,
        text: "A cancelled train, a crowded café, one free chair. Three hours later the coffee was cold and neither of them had noticed.",
      },
      {
        id: "journey-trip",
        title: "Our First Trip",
        date: "December 2023",
        locationId: "first-trip",
        image: story04,
        showMapLink: false,
        text: "Emma met the ocean Lucas grew up with. That week, the distance between the two worlds became a shared address.",
      },
      {
        id: "journey-proposal",
        title: "The Proposal",
        date: "August 2026",
        locationId: "proposal",
        image: story03,
        showMapLink: true,
        text: "Above the clouds, before sunrise, with the lake still asleep below. One question, one word, and every road finally pointed to the same place.",
      },
    ] as JourneyItem[],
  },

  schedule: {
    title: "The Itinerary",
    subtitle: "Le programme du jour",
    items: [
      {
        id: "event-arrival",
        time: "15:30",
        title: "Guest Arrival",
        description: "Welcome drinks on the lake terrace.",
        icon: "arrival",
        locationId: "ceremony",
      },
      {
        id: "event-ceremony",
        time: "16:00",
        title: "Wedding Ceremony",
        description: "In the palace gardens, facing the water.",
        icon: "ceremony",
        locationId: "ceremony",
        dressCode: "Tenue formelle — évitez les talons fins (cérémonie sur l'herbe).",
        rsvp: true,
      },
      {
        id: "event-cocktail",
        time: "17:30",
        title: "Cocktail",
        description: "Champagne, canapés and golden hour by Lake Geneva.",
        icon: "cocktail",
        locationId: "ceremony",
      },
      {
        id: "event-dinner",
        time: "19:30",
        title: "Dinner",
        description: "A seated dinner in the Salle Sandoz.",
        icon: "dinner",
        locationId: "reception",
        rsvp: true,
      },
      {
        id: "event-party",
        time: "22:00",
        title: "Celebration",
        description: "Dancing until the last light on the lake.",
        icon: "party",
        locationId: "reception",
        rsvp: true,
      },
    ] as ScheduleItem[],
  },

  places: {
    title: "The Places We Chose",
    subtitle: "Les lieux du mariage",
    locationIds: ["ceremony", "reception", "hotel-main"],
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
    askTransport: true,
    askAccommodation: true,
    askDepartureCity: true,
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

  /**
   * Contact / WhatsApp. Leave `whatsappNumber` empty and the button never renders.
   * These four values (plus the two country codes above) are the fields a future
   * Speedinvite dashboard can push into the template without code changes.
   */
  contact: {
    enabled: true,
    whatsappNumber: "",
    whatsappMessage: "Hello Emma & Lucas, I have a question about your wedding.",
    label: "WhatsApp",
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
    places: true,
    accommodation: true,
    gallery: true,
    rsvp: true,
    faq: true,
    finalMessage: true,
  } satisfies Record<SectionKey, boolean>,
};

export type WorldBetweenUsConfig = typeof worldBetweenUsConfig;

/** Default location list, cloned so runtime overrides never mutate the config. */
export function defaultLocations(): LocationMap {
  return Object.fromEntries(
    Object.entries(locations).map(([key, value]) => [key, { ...value } as LocationData]),
  );
}

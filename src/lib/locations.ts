/**
 * Single source of truth for every place used by the "The World Between Us" template.
 * Sections never hardcode a place: they reference a location id.
 */

export type LocationData = {
  id: string;
  label: string;
  venueName?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  mapsUrl?: string;
  websiteUrl?: string;
  phone?: string;
  notes?: string;
  /** Optional practical info shown on the Places cards. */
  parking?: string;
  transport?: string;
  /** Optional image id — the picture is edited through <EditableImage id={imageId}>. */
  imageId?: string;
  image?: string;
  imageAlt?: string;
  /** Optional places (first meeting, extra events…) can be hidden. */
  optional?: boolean;
  enabled?: boolean;
};

export type LocationMap = Record<string, LocationData>;

export const EMPTY_LOCATION = (id: string): LocationData => ({
  id,
  label: "",
  latitude: 0,
  longitude: 0,
  optional: true,
  enabled: true,
});

export function isValidLatitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -180 && value <= 180;
}

export function isSafeUrl(url?: string) {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/** Human readable "City, Country" (falls back to the label). */
export function placeLine(location?: LocationData | null) {
  if (!location) return "";
  const parts = [location.city, location.region, location.country].filter(Boolean);
  return parts.length ? parts.join(", ") : location.label;
}

export function fullAddress(location?: LocationData | null) {
  if (!location) return "";
  return [location.address, [location.postalCode, location.city].filter(Boolean).join(" "), location.country]
    .filter((part) => part && String(part).trim().length)
    .join(", ");
}

/** A location is usable by the globe when it has real coordinates. */
export function hasCoordinates(location?: LocationData | null): boolean {
  return Boolean(
    location &&
      isValidLatitude(location.latitude) &&
      isValidLongitude(location.longitude) &&
      !(location.latitude === 0 && location.longitude === 0),
  );
}

export function validateLocation(location: LocationData): string[] {
  const errors: string[] = [];
  if (!location.label?.trim() && !location.city?.trim() && !location.venueName?.trim()) {
    errors.push("Veuillez choisir une ville ou placer le repère sur la carte.");
  }
  if (!isValidLatitude(location.latitude)) errors.push("La latitude doit être comprise entre -90 et 90.");
  if (!isValidLongitude(location.longitude)) errors.push("La longitude doit être comprise entre -180 et 180.");
  if (!isSafeUrl(location.mapsUrl)) errors.push("Le lien Google Maps n'est pas une URL valide.");
  if (!isSafeUrl(location.websiteUrl)) errors.push("Le lien du site web n'est pas une URL valide.");
  return errors;
}

export function mapsSearchUrl(location?: LocationData | null) {
  if (!location) return "";
  if (location.mapsUrl && isSafeUrl(location.mapsUrl)) return location.mapsUrl;
  const query = [location.venueName, fullAddress(location) || location.label].filter(Boolean).join(" ");
  if (query.trim().length) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  if (hasCoordinates(location)) {
    return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
  }
  return "";
}

export function directionsUrl(location?: LocationData | null) {
  if (!location) return "";
  const query = hasCoordinates(location)
    ? `${location.latitude},${location.longitude}`
    : [location.venueName, fullAddress(location) || location.label].filter(Boolean).join(" ");
  if (!query.trim().length) return "";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

/**
 * Great-circle interpolation (slerp) between two geo points.
 * Returns `steps + 1` points that follow the natural curve of the globe.
 */
export function greatCirclePoints(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  steps = 48,
): { lat: number; lng: number }[] {
  const lat1 = a.lat * RAD;
  const lon1 = a.lng * RAD;
  const lat2 = b.lat * RAD;
  const lon2 = b.lng * RAD;

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    );

  if (!Number.isFinite(d) || d < 1e-6) return [a, b];

  const points: { lat: number; lng: number }[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    points.push({ lat: Math.atan2(z, Math.sqrt(x * x + y * y)) * DEG, lng: Math.atan2(y, x) * DEG });
  }
  return points;
}

/** Distance in km — used to detect "same city" origins. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = (b.lat - a.lat) * RAD;
  const dLon = (b.lng - a.lng) * RAD;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

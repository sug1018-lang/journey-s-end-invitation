import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type GeocodeResult = {
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
};

type NominatimItem = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: Record<string, string>;
};

const inputSchema = z.object({ query: z.string().trim().min(2).max(120) });

/**
 * Geocoding proxy. Runs server-side so no API key is ever exposed to the browser.
 * Defaults to OpenStreetMap / Nominatim; set GEOCODING_ENDPOINT / GEOCODING_API_KEY
 * to point it at a SpeedInvite-configured provider instead.
 */
export const searchPlaces = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ results: GeocodeResult[]; error?: string }> => {
    const endpoint = process.env["GEOCODING_ENDPOINT"] ?? "https://nominatim.openstreetmap.org/search";
    const apiKey = process.env["GEOCODING_API_KEY"];

    const url = new URL(endpoint);
    url.searchParams.set("q", data.query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "6");
    if (apiKey) url.searchParams.set("key", apiKey);

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "SpeedInvite/1.0 (wedding invitation location picker)",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        return { results: [], error: `Recherche indisponible (${response.status}).` };
      }
      const items = (await response.json()) as NominatimItem[];
      const results = (Array.isArray(items) ? items : []).map((item): GeocodeResult => {
        const a = item.address ?? {};
        const city = a["city"] ?? a["town"] ?? a["village"] ?? a["municipality"] ?? a["county"] ?? "";
        const street = [a["house_number"], a["road"]].filter(Boolean).join(" ");
        return {
          id: String(item.place_id),
          label: item.display_name,
          venueName: item.name && item.name !== city ? item.name : undefined,
          address: street || undefined,
          city: city || undefined,
          region: a["state"] ?? undefined,
          postalCode: a["postcode"] ?? undefined,
          country: a["country"] ?? undefined,
          countryCode: a["country_code"] ? a["country_code"].toUpperCase() : undefined,
          latitude: Number(item.lat),
          longitude: Number(item.lon),
        };
      });
      return { results };
    } catch {
      return { results: [], error: "Recherche indisponible. Saisissez le lieu manuellement." };
    }
  });

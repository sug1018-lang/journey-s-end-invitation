/**
 * Lightweight country registry used by the intro and the couple's origins.
 * Flags are derived from the ISO code (regional indicator symbols), so no
 * image or icon library is loaded.
 */
export type Country = {
  /** ISO 3166-1 alpha-2 code, uppercase. */
  code: string;
  name: string;
  /** Approximate centroid — used to aim the intro globe when needed. */
  lat: number;
  lng: number;
};

export const COUNTRIES: Country[] = [
  { code: "AL", name: "Albania", lat: 41.15, lng: 20.17 },
  { code: "DZ", name: "Algeria", lat: 28.03, lng: 1.66 },
  { code: "AR", name: "Argentina", lat: -38.42, lng: -63.62 },
  { code: "AM", name: "Armenia", lat: 40.07, lng: 45.04 },
  { code: "AU", name: "Australia", lat: -25.27, lng: 133.78 },
  { code: "AT", name: "Austria", lat: 47.52, lng: 14.55 },
  { code: "AZ", name: "Azerbaijan", lat: 40.14, lng: 47.58 },
  { code: "BD", name: "Bangladesh", lat: 23.68, lng: 90.36 },
  { code: "BE", name: "Belgium", lat: 50.5, lng: 4.47 },
  { code: "BJ", name: "Benin", lat: 9.31, lng: 2.32 },
  { code: "BO", name: "Bolivia", lat: -16.29, lng: -63.59 },
  { code: "BA", name: "Bosnia and Herzegovina", lat: 43.92, lng: 17.68 },
  { code: "BR", name: "Brazil", lat: -14.24, lng: -51.93 },
  { code: "BG", name: "Bulgaria", lat: 42.73, lng: 25.49 },
  { code: "BF", name: "Burkina Faso", lat: 12.24, lng: -1.56 },
  { code: "KH", name: "Cambodia", lat: 12.57, lng: 104.99 },
  { code: "CM", name: "Cameroon", lat: 7.37, lng: 12.35 },
  { code: "CA", name: "Canada", lat: 56.13, lng: -106.35 },
  { code: "CL", name: "Chile", lat: -35.68, lng: -71.54 },
  { code: "CN", name: "China", lat: 35.86, lng: 104.2 },
  { code: "CO", name: "Colombia", lat: 4.57, lng: -74.3 },
  { code: "CD", name: "Congo (DRC)", lat: -4.04, lng: 21.76 },
  { code: "CR", name: "Costa Rica", lat: 9.75, lng: -83.75 },
  { code: "HR", name: "Croatia", lat: 45.1, lng: 15.2 },
  { code: "CU", name: "Cuba", lat: 21.52, lng: -77.78 },
  { code: "CY", name: "Cyprus", lat: 35.13, lng: 33.43 },
  { code: "CZ", name: "Czechia", lat: 49.82, lng: 15.47 },
  { code: "DK", name: "Denmark", lat: 56.26, lng: 9.5 },
  { code: "DO", name: "Dominican Republic", lat: 18.74, lng: -70.16 },
  { code: "EC", name: "Ecuador", lat: -1.83, lng: -78.18 },
  { code: "EG", name: "Egypt", lat: 26.82, lng: 30.8 },
  { code: "SV", name: "El Salvador", lat: 13.79, lng: -88.9 },
  { code: "EE", name: "Estonia", lat: 58.6, lng: 25.01 },
  { code: "ET", name: "Ethiopia", lat: 9.15, lng: 40.49 },
  { code: "FI", name: "Finland", lat: 61.92, lng: 25.75 },
  { code: "FR", name: "France", lat: 46.23, lng: 2.21 },
  { code: "GE", name: "Georgia", lat: 42.32, lng: 43.36 },
  { code: "DE", name: "Germany", lat: 51.17, lng: 10.45 },
  { code: "GH", name: "Ghana", lat: 7.95, lng: -1.02 },
  { code: "GR", name: "Greece", lat: 39.07, lng: 21.82 },
  { code: "GT", name: "Guatemala", lat: 15.78, lng: -90.23 },
  { code: "HT", name: "Haiti", lat: 18.97, lng: -72.29 },
  { code: "HN", name: "Honduras", lat: 15.2, lng: -86.24 },
  { code: "HU", name: "Hungary", lat: 47.16, lng: 19.5 },
  { code: "IS", name: "Iceland", lat: 64.96, lng: -19.02 },
  { code: "IN", name: "India", lat: 20.59, lng: 78.96 },
  { code: "ID", name: "Indonesia", lat: -0.79, lng: 113.92 },
  { code: "IR", name: "Iran", lat: 32.43, lng: 53.69 },
  { code: "IQ", name: "Iraq", lat: 33.22, lng: 43.68 },
  { code: "IE", name: "Ireland", lat: 53.41, lng: -8.24 },
  { code: "IL", name: "Israel", lat: 31.05, lng: 34.85 },
  { code: "IT", name: "Italy", lat: 41.87, lng: 12.57 },
  { code: "CI", name: "Ivory Coast", lat: 7.54, lng: -5.55 },
  { code: "JM", name: "Jamaica", lat: 18.11, lng: -77.3 },
  { code: "JP", name: "Japan", lat: 36.2, lng: 138.25 },
  { code: "JO", name: "Jordan", lat: 30.59, lng: 36.24 },
  { code: "KZ", name: "Kazakhstan", lat: 48.02, lng: 66.92 },
  { code: "KE", name: "Kenya", lat: -0.02, lng: 37.91 },
  { code: "XK", name: "Kosovo", lat: 42.6, lng: 20.9 },
  { code: "LV", name: "Latvia", lat: 56.88, lng: 24.6 },
  { code: "LB", name: "Lebanon", lat: 33.85, lng: 35.86 },
  { code: "LT", name: "Lithuania", lat: 55.17, lng: 23.88 },
  { code: "LU", name: "Luxembourg", lat: 49.82, lng: 6.13 },
  { code: "MG", name: "Madagascar", lat: -18.77, lng: 46.87 },
  { code: "MY", name: "Malaysia", lat: 4.21, lng: 101.98 },
  { code: "MV", name: "Maldives", lat: 3.2, lng: 73.22 },
  { code: "ML", name: "Mali", lat: 17.57, lng: -4.0 },
  { code: "MT", name: "Malta", lat: 35.94, lng: 14.38 },
  { code: "MU", name: "Mauritius", lat: -20.35, lng: 57.55 },
  { code: "MX", name: "Mexico", lat: 23.63, lng: -102.55 },
  { code: "MD", name: "Moldova", lat: 47.41, lng: 28.37 },
  { code: "MA", name: "Morocco", lat: 31.79, lng: -7.09 },
  { code: "MM", name: "Myanmar", lat: 21.91, lng: 95.96 },
  { code: "NP", name: "Nepal", lat: 28.39, lng: 84.12 },
  { code: "NL", name: "Netherlands", lat: 52.13, lng: 5.29 },
  { code: "NZ", name: "New Zealand", lat: -40.9, lng: 174.89 },
  { code: "NG", name: "Nigeria", lat: 9.08, lng: 8.68 },
  { code: "MK", name: "North Macedonia", lat: 41.61, lng: 21.75 },
  { code: "NO", name: "Norway", lat: 60.47, lng: 8.47 },
  { code: "PK", name: "Pakistan", lat: 30.38, lng: 69.35 },
  { code: "PS", name: "Palestine", lat: 31.95, lng: 35.23 },
  { code: "PA", name: "Panama", lat: 8.54, lng: -80.78 },
  { code: "PY", name: "Paraguay", lat: -23.44, lng: -58.44 },
  { code: "PE", name: "Peru", lat: -9.19, lng: -75.02 },
  { code: "PH", name: "Philippines", lat: 12.88, lng: 121.77 },
  { code: "PL", name: "Poland", lat: 51.92, lng: 19.15 },
  { code: "PT", name: "Portugal", lat: 39.4, lng: -8.22 },
  { code: "QA", name: "Qatar", lat: 25.35, lng: 51.18 },
  { code: "RO", name: "Romania", lat: 45.94, lng: 24.97 },
  { code: "RU", name: "Russia", lat: 61.52, lng: 105.32 },
  { code: "RW", name: "Rwanda", lat: -1.94, lng: 29.87 },
  { code: "SA", name: "Saudi Arabia", lat: 23.89, lng: 45.08 },
  { code: "SN", name: "Senegal", lat: 14.5, lng: -14.45 },
  { code: "RS", name: "Serbia", lat: 44.02, lng: 21.01 },
  { code: "SG", name: "Singapore", lat: 1.35, lng: 103.82 },
  { code: "SK", name: "Slovakia", lat: 48.67, lng: 19.7 },
  { code: "SI", name: "Slovenia", lat: 46.15, lng: 14.99 },
  { code: "SO", name: "Somalia", lat: 5.15, lng: 46.2 },
  { code: "ZA", name: "South Africa", lat: -30.56, lng: 22.94 },
  { code: "KR", name: "South Korea", lat: 35.91, lng: 127.77 },
  { code: "ES", name: "Spain", lat: 40.46, lng: -3.75 },
  { code: "LK", name: "Sri Lanka", lat: 7.87, lng: 80.77 },
  { code: "SD", name: "Sudan", lat: 12.86, lng: 30.22 },
  { code: "SE", name: "Sweden", lat: 60.13, lng: 18.64 },
  { code: "CH", name: "Switzerland", lat: 46.82, lng: 8.23 },
  { code: "SY", name: "Syria", lat: 34.8, lng: 38.997 },
  { code: "TW", name: "Taiwan", lat: 23.7, lng: 120.96 },
  { code: "TZ", name: "Tanzania", lat: -6.37, lng: 34.89 },
  { code: "TH", name: "Thailand", lat: 15.87, lng: 100.99 },
  { code: "TN", name: "Tunisia", lat: 33.89, lng: 9.54 },
  { code: "TR", name: "Türkiye", lat: 38.96, lng: 35.24 },
  { code: "UG", name: "Uganda", lat: 1.37, lng: 32.29 },
  { code: "UA", name: "Ukraine", lat: 48.38, lng: 31.17 },
  { code: "AE", name: "United Arab Emirates", lat: 23.42, lng: 53.85 },
  { code: "GB", name: "United Kingdom", lat: 55.38, lng: -3.44 },
  { code: "US", name: "United States", lat: 37.09, lng: -95.71 },
  { code: "UY", name: "Uruguay", lat: -32.52, lng: -55.77 },
  { code: "UZ", name: "Uzbekistan", lat: 41.38, lng: 64.59 },
  { code: "VE", name: "Venezuela", lat: 6.42, lng: -66.59 },
  { code: "VN", name: "Vietnam", lat: 14.06, lng: 108.28 },
  { code: "ZM", name: "Zambia", lat: -13.13, lng: 27.85 },
  { code: "ZW", name: "Zimbabwe", lat: -19.02, lng: 29.15 },
];

/** Regional-indicator flag for any ISO alpha-2 code — no assets needed. */
export function flagEmoji(code?: string): string {
  const value = (code ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(value)) return "";
  return String.fromCodePoint(...[...value].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Returns the country for an ISO code, or undefined when unset/unknown. */
export function findCountry(code?: string): Country | undefined {
  const value = (code ?? "").trim().toUpperCase();
  if (!value) return undefined;
  return COUNTRIES.find((country) => country.code === value);
}

export function countryName(code?: string): string {
  return findCountry(code)?.name ?? "";
}

/**
 * Some desktop systems (notably Windows) render flag emoji as two letter boxes.
 * Measuring the glyph tells us whether to show the flag or fall back to the code.
 */
export function flagEmojiSupported(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return true;
    ctx.font = "24px sans-serif";
    const flag = ctx.measureText("\u{1F1E8}\u{1F1ED}").width;
    const single = ctx.measureText("\u{1F1E8}").width;
    return flag < single * 1.9;
  } catch {
    return true;
  }
}

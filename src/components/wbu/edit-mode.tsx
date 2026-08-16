import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { defaultLocations, worldBetweenUsConfig } from "@/config/worldBetweenUs";
import type { LocationData, LocationMap } from "@/lib/locations";

export type ImageOverride = {
  src?: string;
  focalPoint?: string;
  zoom?: number;
  brightness?: number;
  alt?: string;
};

export type IntroSettings = {
  originOneLocationId: string;
  originTwoLocationId: string;
  destinationLocationId: string;
  showLabels: boolean;
  showRoutes: boolean;
  enableDestinationZoom: boolean;
};

type Overrides = {
  images: Record<string, ImageOverride>;
  texts: Record<string, string>;
  gallery?: { id: string; src: string; alt: string }[];
  locations?: LocationMap;
  intro?: Partial<IntroSettings>;
};

const STORAGE_KEY = "world-between-us-overrides";
const BACKUP_KEY = "world-between-us-overrides-backup";
const ADMIN_KEY = "world-between-us-admin";

const emptyOverrides: Overrides = { images: {}, texts: {} };

const defaultIntroSettings: IntroSettings = {
  originOneLocationId: worldBetweenUsConfig.intro.originOneLocationId,
  originTwoLocationId: worldBetweenUsConfig.intro.originTwoLocationId,
  destinationLocationId: worldBetweenUsConfig.intro.destinationLocationId,
  showLabels: worldBetweenUsConfig.intro.showLabels,
  showRoutes: worldBetweenUsConfig.intro.showRoutes,
  enableDestinationZoom: worldBetweenUsConfig.intro.enableDestinationZoom,
};

type EditModeContextValue = {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  overrides: Overrides;
  getImage: (id: string) => ImageOverride | undefined;
  setImage: (id: string, value: ImageOverride | null) => void;
  getText: (id: string, fallback: string) => string;
  setText: (id: string, value: string | null) => void;
  setGallery: (items: { id: string; src: string; alt: string }[] | null) => void;
  /** Every place of the invitation, merged defaults + saved edits. */
  locations: LocationMap;
  getLocation: (id?: string) => LocationData | undefined;
  introSettings: IntroSettings;
  /** Persist a whole set of places + intro settings (used by the Places editor). */
  applyLocations: (locations: LocationMap, intro: IntroSettings) => void;
  /** Restores the state captured before the last save. */
  restorePreviousLocations: () => boolean;
  resetAll: () => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

function mergeLocations(saved?: LocationMap): LocationMap {
  const base = defaultLocations();
  if (!saved) return base;
  const merged: LocationMap = { ...base };
  for (const [id, value] of Object.entries(saved)) {
    merged[id] = { ...(base[id] ?? {}), ...value, id };
  }
  return merged;
}

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState<Overrides>(emptyOverrides);
  const backupRef = useRef<Overrides | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramValue = params.get("edit");
      if (paramValue === "1") window.localStorage.setItem(ADMIN_KEY, "true");
      if (paramValue === "0") window.localStorage.removeItem(ADMIN_KEY);
      setIsAdmin(window.localStorage.getItem(ADMIN_KEY) === "true");

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Overrides>;
        setOverrides({
          images: parsed.images ?? {},
          texts: parsed.texts ?? {},
          gallery: parsed.gallery,
          locations: parsed.locations,
          intro: parsed.intro,
        });
      }
      const backup = window.localStorage.getItem(BACKUP_KEY);
      if (backup) backupRef.current = JSON.parse(backup) as Overrides;
    } catch {
      /* storage unavailable — stay on defaults */
    }
  }, []);

  const persist = useCallback((next: Overrides) => {
    setOverrides(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota or private mode — keep in memory */
    }
  }, []);

  const locations = useMemo(() => mergeLocations(overrides.locations), [overrides.locations]);
  const introSettings = useMemo<IntroSettings>(
    () => ({ ...defaultIntroSettings, ...(overrides.intro ?? {}) }),
    [overrides.intro],
  );

  const value = useMemo<EditModeContextValue>(
    () => ({
      isAdmin,
      editMode: isAdmin && editMode,
      setEditMode,
      overrides,
      getImage: (id) => overrides.images[id],
      setImage: (id, next) => {
        const images = { ...overrides.images };
        if (next === null) delete images[id];
        else images[id] = { ...images[id], ...next };
        persist({ ...overrides, images });
      },
      getText: (id, fallback) => overrides.texts[id] ?? fallback,
      setText: (id, next) => {
        const texts = { ...overrides.texts };
        if (next === null) delete texts[id];
        else texts[id] = next;
        persist({ ...overrides, texts });
      },
      setGallery: (items) => persist({ ...overrides, gallery: items ?? undefined }),
      locations,
      getLocation: (id) => (id ? locations[id] : undefined),
      introSettings,
      applyLocations: (nextLocations, nextIntro) => {
        backupRef.current = overrides;
        try {
          window.localStorage.setItem(BACKUP_KEY, JSON.stringify(overrides));
        } catch {
          /* ignore */
        }
        persist({ ...overrides, locations: nextLocations, intro: nextIntro });
      },
      restorePreviousLocations: () => {
        const backup = backupRef.current;
        if (!backup) return false;
        persist(backup);
        return true;
      },
      resetAll: () => persist(emptyOverrides),
    }),
    [isAdmin, editMode, overrides, persist, locations, introSettings],
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode must be used inside <EditModeProvider>");
  return ctx;
}

/** Reads a file input / drop as a compressed data URL so it survives reloads. */
export async function fileToCompressedDataUrl(file: File, maxSize = 1600): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = dataUrl;
    });
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.82);
  } catch {
    return dataUrl;
  }
}

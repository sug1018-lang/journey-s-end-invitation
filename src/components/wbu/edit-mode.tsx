import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ImageOverride = {
  src?: string;
  focalPoint?: string;
  zoom?: number;
  brightness?: number;
};

type Overrides = {
  images: Record<string, ImageOverride>;
  texts: Record<string, string>;
  gallery?: { id: string; src: string; alt: string }[];
};

const STORAGE_KEY = "world-between-us-overrides";
const ADMIN_KEY = "world-between-us-admin";

const emptyOverrides: Overrides = { images: {}, texts: {} };

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
  resetAll: () => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState<Overrides>(emptyOverrides);

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
        });
      }
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
      resetAll: () => persist(emptyOverrides),
    }),
    [isAdmin, editMode, overrides, persist],
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

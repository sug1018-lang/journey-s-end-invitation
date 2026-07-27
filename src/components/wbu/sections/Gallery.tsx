import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { cn } from "@/lib/utils";
import { EditableImage } from "../EditableImage";
import { fileToCompressedDataUrl, useEditMode } from "../edit-mode";
import { Reveal, SectionHeading } from "../primitives";

const { gallery } = worldBetweenUsConfig;

export function Gallery() {
  const { editMode, overrides, setGallery, getImage } = useEditMode();
  const items = overrides.gallery ?? gallery.items;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setLightbox(null), []);
  const move = useCallback(
    (dir: 1 | -1) =>
      setLightbox((current) =>
        current === null ? current : (current + dir + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, close, move]);

  const addPhoto = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const src = await fileToCompressedDataUrl(file);
    setGallery([...items, { id: `g-${Date.now()}`, src, alt: "Photo ajoutée par les mariés" }]);
  };

  const removePhoto = (id: string) => setGallery(items.filter((item) => item.id !== id));

  const reorder = (index: number, dir: 1 | -1) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setGallery(next);
  };

  const current = lightbox === null ? null : items[lightbox];
  const currentSrc = current ? (getImage(`gallery-${current.id}`)?.src ?? current.src) : "";

  return (
    <section id="gallery" className="relative py-24">
      <div className="section-shell">
        <SectionHeading overline={gallery.subtitle} title={gallery.title} titleId="gallery-title" />

        <div className="mt-14 grid grid-cols-2 gap-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={(index % 4) * 60} className={cn(index % 3 === 0 && "col-span-2")}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLightbox(index)}
                  className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                  aria-label={`Agrandir : ${item.alt}`}
                >
                  <EditableImage
                    id={`gallery-${item.id}`}
                    src={item.src}
                    alt={item.alt}
                    ratio={index % 3 === 0 ? "3 / 2" : "3 / 4"}
                    className="rounded-sm border border-steel/40 transition duration-700 hover:brightness-110"
                  />
                </button>
                {editMode ? (
                  <div className="absolute left-2 top-2 z-20 flex gap-1">
                    <IconAction label="Déplacer à gauche" onClick={() => reorder(index, -1)}>
                      <ArrowLeft className="size-3.5" />
                    </IconAction>
                    <IconAction label="Déplacer à droite" onClick={() => reorder(index, 1)}>
                      <ArrowRight className="size-3.5" />
                    </IconAction>
                    <IconAction label="Supprimer la photo" onClick={() => removePhoto(item.id)}>
                      <Trash2 className="size-3.5" />
                    </IconAction>
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        {editMode ? (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => void addPhoto(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-champagne/50 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-champagne"
            >
              <Plus className="size-4" /> Ajouter une photo
            </button>
          </>
        ) : null}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={close}
        >
          <img
            src={currentSrc}
            alt={current.alt}
            className="max-h-[82svh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-cloud/25 text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            style={{ top: "max(1rem, env(safe-area-inset-top))" }}
          >
            <X className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            className="absolute left-3 grid size-11 place-items-center rounded-full border border-cloud/20 text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            className="absolute right-3 grid size-11 place-items-center rounded-full border border-cloud/20 text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-full border border-champagne/40 bg-ink/70 text-ivory backdrop-blur-md transition hover:border-champagne"
    >
      {children}
    </button>
  );
}

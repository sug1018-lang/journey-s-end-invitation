import { useCallback, useRef, useState, type DragEvent } from "react";
import { ImageUp, RotateCcw, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { fileToCompressedDataUrl, useEditMode } from "./edit-mode";

type EditableImageProps = {
  /** Stable id — the override is stored under this key. */
  id: string;
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** aspect-ratio css value, e.g. "3 / 4". Keeps the template layout stable. */
  ratio?: string;
  priority?: boolean;
  overlay?: "none" | "soft" | "strong" | "bottom";
};

const overlayClass: Record<NonNullable<EditableImageProps["overlay"]>, string> = {
  none: "",
  soft: "bg-[linear-gradient(to_top,rgba(9,20,38,0.65),rgba(9,20,38,0.15))]",
  strong: "bg-[linear-gradient(to_top,rgba(9,20,38,0.9),rgba(9,20,38,0.45)_55%,rgba(9,20,38,0.7))]",
  bottom: "bg-[linear-gradient(to_top,rgba(9,20,38,0.92),transparent_60%)]",
};

export function EditableImage({
  id,
  src,
  alt,
  className,
  imgClassName,
  ratio,
  priority = false,
  overlay = "none",
}: EditableImageProps) {
  const { editMode, getImage, setImage } = useEditMode();
  const override = getImage(id);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSrc = override?.src ?? src;
  const focal = override?.focalPoint ?? "50% 50%";
  const zoom = override?.zoom ?? 1;
  const brightness = override?.brightness ?? 1;

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const dataUrl = await fileToCompressedDataUrl(file);
      setImage(id, { src: dataUrl });
    },
    [id, setImage],
  );

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void handleFiles(event.dataTransfer.files);
  };

  const pickFocal = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
    setImage(id, { focalPoint: `${x}% ${y}%` });
  };

  return (
    <div className={cn("group relative overflow-hidden", className)} style={{ aspectRatio: ratio }}>
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={cn("h-full w-full object-cover", imgClassName)}
        style={{
          objectPosition: focal,
          transform: `scale(${zoom})`,
          filter: `brightness(${brightness})`,
          willChange: "transform",
        }}
      />
      {overlay !== "none" ? (
        <div className={cn("pointer-events-none absolute inset-0", overlayClass[overlay])} />
      ) : null}

      {editMode ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-2 rounded-full border border-champagne/50 bg-ink/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ivory backdrop-blur-md transition hover:border-champagne"
          >
            <ImageUp className="size-3.5" />
            Remplacer l'image
          </button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md border-steel/60 bg-deep text-ivory">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-light">Remplacer l'image</DialogTitle>
                <DialogDescription className="text-cloud/70">
                  Glissez une photo, ajustez le cadrage et le point focal. Le ratio du template est conservé.
                </DialogDescription>
              </DialogHeader>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={pickFocal}
                className={cn(
                  "relative cursor-crosshair overflow-hidden rounded-lg border border-dashed transition",
                  dragging ? "border-champagne" : "border-steel/70",
                )}
                style={{ aspectRatio: ratio ?? "16 / 10" }}
              >
                <img
                  src={currentSrc}
                  alt="Aperçu"
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: focal,
                    transform: `scale(${zoom})`,
                    filter: `brightness(${brightness})`,
                  }}
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-ink/70 px-2 py-1 text-center text-[10px] uppercase tracking-[0.2em] text-cloud/80">
                  Cliquez pour définir le point focal
                </span>
              </div>

              <div className="space-y-4 text-xs uppercase tracking-[0.18em] text-cloud/70">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span>Zoom</span>
                    <span>{zoom.toFixed(2)}×</span>
                  </div>
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={2}
                    step={0.01}
                    onValueChange={([v]) => setImage(id, { zoom: v })}
                  />
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span>Luminosité</span>
                    <span>{Math.round(brightness * 100)}%</span>
                  </div>
                  <Slider
                    value={[brightness]}
                    min={0.5}
                    max={1.4}
                    step={0.01}
                    onValueChange={([v]) => setImage(id, { brightness: v })}
                  />
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => void handleFiles(e.target.files)}
              />

              <DialogFooter className="gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-cloud/70 hover:text-ivory"
                  onClick={() => setImage(id, null)}
                >
                  <RotateCcw /> Réinitialiser
                </Button>
                <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
                  <UploadCloud /> Choisir un fichier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </div>
  );
}

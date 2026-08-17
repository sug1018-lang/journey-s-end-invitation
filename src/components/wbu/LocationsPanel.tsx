import { useEffect, useMemo, useState } from "react";
import { Globe2, MapPin, Pencil, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { hasCoordinates, placeLine, type LocationData, type LocationMap } from "@/lib/locations";
import { LocationPicker } from "./LocationPicker";
import { WorldBetweenUsIntro } from "./WorldBetweenUsIntro";
import { useEditMode, type IntroSettings } from "./edit-mode";

const { intro, hero } = worldBetweenUsConfig;

export function LocationsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { locations, introSettings, applyLocations, restorePreviousLocations } = useEditMode();
  const [draft, setDraft] = useState<LocationMap>(locations);
  const [draftIntro, setDraftIntro] = useState<IntroSettings>(introSettings);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (open) {
      setDraft(locations);
      setDraftIntro(introSettings);
      setStatus("");
    }
  }, [open, locations, introSettings]);

  const list = useMemo(() => Object.values(draft), [draft]);
  const editing = editingId ? draft[editingId] : null;

  const save = () => {
    applyLocations(draft, draftIntro);
    setStatus("Lieux enregistrés — l'invitation est à jour.");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Les lieux de votre histoire</SheetTitle>
            <SheetDescription>
              Chaque lieu n'existe qu'une fois : le globe d'introduction, le programme, la section
              Lieux et tous les liens de carte utilisent ces informations.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-8">
            <section className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Introduction</h3>

              <IntroSelect
                label="Origine — première personne"
                value={draftIntro.originOneLocationId}
                options={list}
                onChange={(id) => setDraftIntro((s) => ({ ...s, originOneLocationId: id }))}
              />
              <IntroSelect
                label="Origine — deuxième personne"
                value={draftIntro.originTwoLocationId}
                options={list}
                onChange={(id) => setDraftIntro((s) => ({ ...s, originTwoLocationId: id }))}
              />
              <IntroSelect
                label="Destination (lieu du mariage)"
                value={draftIntro.destinationLocationId}
                options={list}
                onChange={(id) => setDraftIntro((s) => ({ ...s, destinationLocationId: id }))}
              />

              <Toggle
                label="Afficher les noms des lieux"
                checked={draftIntro.showLabels}
                onChange={(v) => setDraftIntro((s) => ({ ...s, showLabels: v }))}
              />
              <Toggle
                label="Afficher les trajets sur le globe"
                checked={draftIntro.showRoutes}
                onChange={(v) => setDraftIntro((s) => ({ ...s, showRoutes: v }))}
              />
              <Toggle
                label="Zoom final sur la destination"
                checked={draftIntro.enableDestinationZoom}
                onChange={(v) => setDraftIntro((s) => ({ ...s, enableDestinationZoom: v }))}
              />

              <Button type="button" variant="secondary" className="w-full" onClick={() => setPreviewing(true)}>
                <Globe2 className="size-4" /> Aperçu de l'introduction
              </Button>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tous les lieux</h3>
              <ul className="space-y-2">
                {list.map((location) => (
                  <li
                    key={location.id}
                    className="flex items-start gap-3 rounded-md border p-3 text-sm"
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0 opacity-60" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {location.venueName || location.label || "Lieu sans nom"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {placeLine(location) || "Adresse à compléter"}
                      </p>
                      {!hasCoordinates(location) ? (
                        <p className="mt-1 text-xs text-destructive">Coordonnées manquantes</p>
                      ) : null}
                      {location.optional ? (
                        <div className="mt-2">
                          <Toggle
                            label="Afficher ce lieu"
                            checked={location.enabled !== false}
                            onChange={(v) =>
                              setDraft((current) => ({
                                ...current,
                                [location.id]: { ...current[location.id]!, enabled: v },
                              }))
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(location.id)}
                      aria-label={`Modifier ${location.label}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </section>

            {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}

            <div className="flex flex-col gap-2">
              <Button type="button" onClick={save}>
                Enregistrer les lieux
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDraft(locations);
                  setDraftIntro(introSettings);
                  setStatus("Modifications annulées.");
                }}
              >
                Annuler les modifications
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setStatus(
                    restorePreviousLocations()
                      ? "Version précédente restaurée."
                      : "Aucune version précédente enregistrée.",
                  )
                }
              >
                <RotateCcw className="size-4" /> Restaurer la version précédente
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {editing ? (
        <LocationPicker
          open={Boolean(editingId)}
          onOpenChange={(value) => !value && setEditingId(null)}
          location={editing}
          onSave={(next) => {
            setDraft((current) => ({ ...current, [next.id]: next }));
            setEditingId(null);
          }}
        />
      ) : null}

      {previewing ? (
        <WorldBetweenUsIntro
          preview
          onFinish={() => setPreviewing(false)}
          places={{
            originOne: draft[draftIntro.originOneLocationId],
            originTwo: draft[draftIntro.originTwoLocationId],
            destination: draft[draftIntro.destinationLocationId],
            tagline: intro.tagline,
            sameOriginTagline: intro.sameOriginTagline,
            showLabels: draftIntro.showLabels,
            showRoutes: draftIntro.showRoutes,
            enableDestinationZoom: draftIntro.enableDestinationZoom,
            destinationImage: hero.backgroundImage,
          }}
        />
      ) : null}
    </>
  );
}

function IntroSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: LocationData[];
  onChange: (id: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir un lieu" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.venueName || option.label || option.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

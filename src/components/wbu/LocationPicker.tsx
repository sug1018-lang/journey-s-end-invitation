import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { searchPlaces, type GeocodeResult } from "@/lib/geocode.functions";
import { hasCoordinates, validateLocation, type LocationData } from "@/lib/locations";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: LocationData;
  onSave: (location: LocationData) => void;
};

function osmEmbed(location: LocationData) {
  if (!hasCoordinates(location)) return "";
  const d = 0.01;
  const bbox = [
    location.longitude - d,
    location.latitude - d,
    location.longitude + d,
    location.latitude + d,
  ].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`;
}

export function LocationPicker({ open, onOpenChange, location, onSave }: Props) {
  const [draft, setDraft] = useState<LocationData>(location);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const runSearch = useServerFn(searchPlaces);

  useEffect(() => {
    if (open) {
      setDraft(location);
      setQuery("");
      setResults([]);
      setErrors([]);
      setSearchError("");
    }
  }, [open, location]);

  const patch = useCallback((next: Partial<LocationData>) => {
    setDraft((current) => ({ ...current, ...next }));
  }, []);

  const search = useCallback(async () => {
    const value = query.trim();
    if (value.length < 2) return;
    setSearching(true);
    setSearchError("");
    try {
      const response = await runSearch({ data: { query: value } });
      setResults(response.results);
      if (response.error) setSearchError(response.error);
      else if (!response.results.length) setSearchError("Aucun lieu trouvé pour cette recherche.");
    } catch {
      setSearchError("La recherche est momentanément indisponible. Saisissez le lieu manuellement.");
    } finally {
      setSearching(false);
    }
  }, [query, runSearch]);

  const apply = (result: GeocodeResult) => {
    patch({
      label: result.venueName || result.city || result.label,
      venueName: result.venueName ?? draft.venueName,
      address: result.address ?? "",
      city: result.city ?? "",
      region: result.region ?? "",
      postalCode: result.postalCode ?? "",
      country: result.country ?? "",
      countryCode: result.countryCode ?? "",
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setResults([]);
  };

  const save = () => {
    const issues = validateLocation(draft);
    setErrors(issues);
    if (issues.length) return;
    onSave({ ...draft, label: draft.label || draft.venueName || draft.city || "" });
    onOpenChange(false);
  };

  const embed = osmEmbed(draft);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier le lieu</DialogTitle>
          <DialogDescription>
            Recherchez une adresse, ajustez les détails, puis enregistrez. Le globe, le programme et
            les liens de carte se mettent à jour automatiquement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wbu-place-search">Rechercher une adresse</Label>
            <div className="flex gap-2">
              <Input
                id="wbu-place-search"
                value={query}
                placeholder="Ex : Beau-Rivage Palace, Lausanne"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void search();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={() => void search()} disabled={searching}>
                {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                <span className="sr-only">Rechercher</span>
              </Button>
            </div>
            {searchError ? <p className="text-xs text-muted-foreground">{searchError}</p> : null}
            {results.length ? (
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-1">
                {results.map((result) => (
                  <li key={result.id}>
                    <button
                      type="button"
                      onClick={() => apply(result)}
                      className="flex w-full items-start gap-2 rounded-sm px-2 py-2 text-left text-sm transition hover:bg-muted"
                    >
                      <MapPin className="mt-0.5 size-3.5 shrink-0 opacity-60" />
                      <span>{result.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {embed ? (
            <iframe
              title="Aperçu de la carte"
              src={embed}
              className="h-48 w-full rounded-md border"
              loading="lazy"
            />
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nom du lieu" value={draft.venueName ?? ""} onChange={(v) => patch({ venueName: v })} />
            <Field label="Nom affiché" value={draft.label} onChange={(v) => patch({ label: v })} />
            <Field label="Adresse" value={draft.address ?? ""} onChange={(v) => patch({ address: v })} />
            <Field label="Code postal" value={draft.postalCode ?? ""} onChange={(v) => patch({ postalCode: v })} />
            <Field label="Ville" value={draft.city ?? ""} onChange={(v) => patch({ city: v })} />
            <Field label="Pays" value={draft.country ?? ""} onChange={(v) => patch({ country: v })} />
            <Field
              label="Latitude"
              value={String(draft.latitude ?? "")}
              onChange={(v) => patch({ latitude: Number(v) })}
              type="number"
            />
            <Field
              label="Longitude"
              value={String(draft.longitude ?? "")}
              onChange={(v) => patch({ longitude: Number(v) })}
              type="number"
            />
            <Field label="Lien Google Maps" value={draft.mapsUrl ?? ""} onChange={(v) => patch({ mapsUrl: v })} />
            <Field label="Site web" value={draft.websiteUrl ?? ""} onChange={(v) => patch({ websiteUrl: v })} />
            <Field label="Transport" value={draft.transport ?? ""} onChange={(v) => patch({ transport: v })} />
            <Field label="Parking" value={draft.parking ?? ""} onChange={(v) => patch({ parking: v })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wbu-place-notes">Note pour les invités</Label>
            <Textarea
              id="wbu-place-notes"
              value={draft.notes ?? ""}
              rows={3}
              onChange={(event) => patch({ notes: event.target.value })}
            />
          </div>

          {errors.length ? (
            <ul className="space-y-1 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={save}>
            Enregistrer le lieu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = `wbu-field-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

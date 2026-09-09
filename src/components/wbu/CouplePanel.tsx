import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES, flagEmoji } from "@/lib/countries";
import { useEditMode } from "./edit-mode";
import { normalizeWhatsappNumber } from "./WhatsAppButton";

/** Couple settings: the two origin countries + the WhatsApp contact button. */
export function CouplePanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const { countrySettings, applyCountries, contactSettings, applyContact } = useEditMode();

  const [one, setOne] = useState(countrySettings.partner1Country);
  const [two, setTwo] = useState(countrySettings.partner2Country);
  const [enabled, setEnabled] = useState(contactSettings.enabled);
  const [number, setNumber] = useState(contactSettings.whatsappNumber);
  const [message, setMessage] = useState(contactSettings.whatsappMessage);
  const [label, setLabel] = useState(contactSettings.label);

  useEffect(() => {
    if (!open) return;
    setOne(countrySettings.partner1Country);
    setTwo(countrySettings.partner2Country);
    setEnabled(contactSettings.enabled);
    setNumber(contactSettings.whatsappNumber);
    setMessage(contactSettings.whatsappMessage);
    setLabel(contactSettings.label);
  }, [open, countrySettings, contactSettings]);

  const save = () => {
    applyCountries({ partner1Country: one, partner2Country: two });
    applyContact({
      enabled,
      whatsappNumber: number.trim(),
      whatsappMessage: message,
      label: label.trim() || "WhatsApp",
    });
    onOpenChange(false);
  };

  const digits = normalizeWhatsappNumber(number);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Pays &amp; contact</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-10">
          <section className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Pays d'origine
            </p>
            <CountrySelect id="country-one" label="Pays — Partenaire 1" value={one} onChange={setOne} />
            <CountrySelect id="country-two" label="Pays — Partenaire 2" value={two} onChange={setTwo} />
            <p className="text-xs text-muted-foreground">
              Laissez « Aucun » pour garder l'introduction générique.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Bouton WhatsApp
              </p>
              <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Activer WhatsApp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa-number">Numéro (format international)</Label>
              <Input
                id="wa-number"
                inputMode="tel"
                placeholder="+41 79 000 00 00"
                value={number}
                onChange={(event) => setNumber(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {digits.length >= 6
                  ? `Le bouton ouvrira wa.me/${digits}`
                  : "Sans numéro valide, le bouton reste masqué."}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa-label">Texte du bouton</Label>
              <Input id="wa-label" value={label} onChange={(event) => setLabel(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa-message">Message pré-rempli</Label>
              <Textarea
                id="wa-message"
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>
          </section>

          <Button className="w-full" onClick={save}>
            Enregistrer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CountrySelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Aucun</option>
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {flagEmoji(country.code)} {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}

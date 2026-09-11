import { useEffect, useState } from "react";
import { ChevronLeft, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { findCountry, flagEmoji } from "@/lib/countries";
import { distanceKm } from "@/lib/locations";
import { CountryQuickPicker } from "./CountryQuickPicker";
import { useEditMode } from "./edit-mode";
import { useFlagSupport } from "./use-flag-support";
import { normalizeWhatsappNumber } from "./WhatsAppButton";
import { REPLAY_INTRO_EVENT } from "./intro-events";

/** Couple settings: the two origin countries + the WhatsApp contact button. */
export function CouplePanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const { countrySettings, applyCountries, contactSettings, applyContact } = useEditMode();
  const flagsOk = useFlagSupport();

  const [one, setOne] = useState(countrySettings.partner1Country);
  const [two, setTwo] = useState(countrySettings.partner2Country);
  const [picking, setPicking] = useState<null | 1 | 2>(null);
  const [enabled, setEnabled] = useState(contactSettings.enabled);
  const [number, setNumber] = useState(contactSettings.whatsappNumber);
  const [message, setMessage] = useState(contactSettings.whatsappMessage);
  const [label, setLabel] = useState(contactSettings.label);

  useEffect(() => {
    if (!open) return;
    setPicking(null);
    setOne(countrySettings.partner1Country);
    setTwo(countrySettings.partner2Country);
    setEnabled(contactSettings.enabled);
    setNumber(contactSettings.whatsappNumber);
    setMessage(contactSettings.whatsappMessage);
    setLabel(contactSettings.label);
  }, [open, countrySettings, contactSettings]);

  const countryOne = findCountry(one);
  const countryTwo = findCountry(two);
  const between =
    countryOne && countryTwo
      ? Math.round(
          distanceKm(
            { lat: countryOne.lat, lng: countryOne.lng },
            { lat: countryTwo.lat, lng: countryTwo.lng },
          ),
        )
      : null;

  const saveCountries = () => applyCountries({ partner1Country: one, partner2Country: two });

  const save = () => {
    saveCountries();
    applyContact({
      enabled,
      whatsappNumber: number.trim(),
      whatsappMessage: message,
      label: label.trim() || "WhatsApp",
    });
    onOpenChange(false);
  };

  const replay = () => {
    saveCountries();
    onOpenChange(false);
    window.dispatchEvent(new CustomEvent(REPLAY_INTRO_EVENT));
  };

  const digits = normalizeWhatsappNumber(number);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Vos deux pays</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="countries" className="mt-5">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="countries">Pays</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="countries" className="space-y-5 pb-10">
            {picking ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPicking(null)}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4" /> Retour
                </button>
                <p className="text-sm font-medium">
                  Pays du marié {picking === 1 ? "1" : "2"}
                </p>
                <CountryQuickPicker
                  value={picking === 1 ? one : two}
                  onSelect={(code) => {
                    if (picking === 1) setOne(code);
                    else setTwo(code);
                    setPicking(null);
                  }}
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <CountryCard
                    title="Marié·e 1"
                    code={one}
                    flagsOk={flagsOk}
                    onClick={() => setPicking(1)}
                  />
                  <CountryCard
                    title="Marié·e 2"
                    code={two}
                    flagsOk={flagsOk}
                    onClick={() => setPicking(2)}
                  />
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  {between !== null
                    ? `${between.toLocaleString("fr-FR")} km séparaient vos deux pays.`
                    : "Choisissez un pays pour chacun pour personnaliser l'introduction."}
                </p>

                <div className="space-y-2">
                  <Button className="w-full" onClick={save}>
                    Enregistrer
                  </Button>
                  <Button variant="outline" className="w-full" onClick={replay}>
                    <Play className="size-4" /> Revoir l'introduction
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 pb-10">
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
            <Button className="w-full" onClick={save}>
              Enregistrer
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function CountryCard({
  title,
  code,
  flagsOk,
  onClick,
}: {
  title: string;
  code: string;
  flagsOk: boolean;
  onClick: () => void;
}) {
  const country = findCountry(code);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-border p-4 text-center transition hover:bg-accent"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{title}</span>
      <span className="text-3xl leading-none">
        {country ? (flagsOk ? flagEmoji(country.code) : country.code) : "🌍"}
      </span>
      <span className="text-sm font-medium">{country?.name ?? "Choisir un pays"}</span>
    </button>
  );
}

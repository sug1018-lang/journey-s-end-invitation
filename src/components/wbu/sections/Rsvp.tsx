import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { cn } from "@/lib/utils";
import { EditableText } from "../EditableText";
import { Reveal, SectionHeading } from "../primitives";

const { rsvp } = worldBetweenUsConfig;

const fieldClass =
  "w-full rounded-sm border border-steel/50 bg-deep/40 px-4 py-3 text-sm text-ivory placeholder:text-cloud/40 outline-none transition focus:border-champagne focus-visible:ring-1 focus-visible:ring-champagne";

const labelClass = "mb-2 block text-[10px] uppercase tracking-[0.24em] text-champagne/85";

export function Rsvp() {
  const [sent, setSent] = useState(false);
  const [attending, setAttending] = useState<"yes" | "no">("yes");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aucune donnée n'est envoyée à un tiers : branchez ici votre backend / Lovable Cloud.
    setSent(true);
  };

  return (
    <section id="rsvp" className="relative py-24">
      <div className="section-shell">
        <SectionHeading overline="RSVP" title={rsvp.title} subtitle={rsvp.subtitle} titleId="rsvp-title" />

        <Reveal delay={80}>
          {sent ? (
            <div className="mt-12 rounded-sm border border-champagne/35 bg-deep/50 p-8 text-center backdrop-blur-md">
              <div className="mx-auto grid size-12 place-items-center rounded-full border border-champagne/50">
                <Check className="size-5 text-champagne" />
              </div>
              <EditableText
                id="rsvp-success-title"
                value={rsvp.successTitle}
                as="h3"
                className="mt-5 block font-display text-2xl font-light text-ivory"
              />
              <EditableText
                id="rsvp-success-body"
                value={rsvp.successBody}
                as="p"
                multiline
                className="mt-3 text-sm leading-relaxed text-cloud/70"
              />
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-12 space-y-6">
              <div>
                <label className={labelClass} htmlFor="rsvp-name">
                  Nom et prénom
                </label>
                <input id="rsvp-name" name="name" required className={fieldClass} placeholder="Emma Lambert" />
              </div>

              <div>
                <span className={labelClass}>Serez-vous des nôtres ?</span>
                <div className="grid grid-cols-2 gap-3">
                  {(["yes", "no"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAttending(value)}
                      aria-pressed={attending === value}
                      className={cn(
                        "rounded-sm border px-4 py-3 text-[11px] uppercase tracking-[0.2em] transition",
                        attending === value
                          ? "border-champagne bg-champagne text-ink"
                          : "border-steel/50 text-cloud/70 hover:border-champagne/60",
                      )}
                    >
                      {value === "yes" ? "Avec joie" : "Absent(e)"}
                    </button>
                  ))}
                </div>
              </div>

              {attending === "yes" ? (
                <>
                  <div>
                    <label className={labelClass} htmlFor="rsvp-guests">
                      Nombre de personnes
                    </label>
                    <input
                      id="rsvp-guests"
                      name="guests"
                      type="number"
                      min={1}
                      max={10}
                      defaultValue={2}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="rsvp-meal">
                      Choix du repas
                    </label>
                    <select id="rsvp-meal" name="meal" className={fieldClass} defaultValue={rsvp.mealOptions[0]}>
                      {rsvp.mealOptions.map((option) => (
                        <option key={option} value={option} className="bg-deep">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="rsvp-allergies">
                      Allergies ou régime particulier
                    </label>
                    <input id="rsvp-allergies" name="allergies" className={fieldClass} placeholder="—" />
                  </div>

                  <div className="space-y-3">
                    <CheckboxRow id="rsvp-hotel" label="J'ai besoin d'un hébergement" />
                    <CheckboxRow id="rsvp-transport" label="J'ai besoin d'une navette" />
                  </div>
                </>
              ) : null}

              <div>
                <label className={labelClass} htmlFor="rsvp-message">
                  Un mot pour les mariés
                </label>
                <textarea id="rsvp-message" name="message" rows={4} className={fieldClass} placeholder="—" />
              </div>

              <button
                type="submit"
                className="w-full rounded-sm border border-champagne bg-champagne px-6 py-4 text-[11px] uppercase tracking-[0.26em] text-ink transition hover:bg-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {rsvp.submitLabel}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function CheckboxRow({ id, label }: { id: string; label: string }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 rounded-sm border border-steel/40 bg-deep/30 px-4 py-3 text-sm text-cloud/80"
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        className="size-4 accent-[var(--champagne)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
      />
      {label}
    </label>
  );
}

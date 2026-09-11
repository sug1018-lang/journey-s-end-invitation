import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { COUNTRIES, flagEmoji, type Country } from "@/lib/countries";
import { useFlagSupport } from "./use-flag-support";

const POPULAR = ["FR", "CH", "IT", "PT", "MA", "IN", "LK", "US", "BR", "VN"];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Searchable country list with a row of frequent choices on top. */
export function CountryQuickPicker({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (code: string) => void;
}) {
  const [query, setQuery] = useState("");
  const flagsOk = useFlagSupport();

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (country) => normalize(country.name).includes(q) || normalize(country.code).startsWith(q),
    );
  }, [query]);

  const popular = useMemo(
    () => POPULAR.map((code) => COUNTRIES.find((c) => c.code === code)).filter(Boolean) as Country[],
    [],
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un pays…"
          aria-label="Rechercher un pays"
          className="pl-9"
        />
      </div>

      {!query ? (
        <div className="flex flex-wrap gap-2">
          {popular.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => onSelect(country.code)}
              className="rounded-full border border-border px-3 py-1.5 text-xs transition hover:bg-accent"
            >
              {flagsOk ? `${flagEmoji(country.code)} ` : ""}
              {country.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="max-h-72 overflow-y-auto rounded-md border border-border">
        {results.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Aucun pays trouvé.</p>
        ) : (
          <ul>
            {results.map((country) => {
              const selected = country.code === value;
              return (
                <li key={country.code}>
                  <button
                    type="button"
                    onClick={() => onSelect(country.code)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-accent ${
                      selected ? "bg-accent" : ""
                    }`}
                  >
                    <span className="w-8 shrink-0 text-base">
                      {flagsOk ? flagEmoji(country.code) : country.code}
                    </span>
                    <span className="flex-1">{country.name}</span>
                    {selected ? <Check className="size-4 text-primary" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSelect("")}
        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        Aucun pays (introduction générique)
      </button>
    </div>
  );
}

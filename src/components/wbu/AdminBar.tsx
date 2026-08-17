import { useState } from "react";
import { MapPin, PencilLine, RotateCcw, Eye } from "lucide-react";

import { LocationsPanel } from "./LocationsPanel";
import { useEditMode } from "./edit-mode";

/** Discreet bar shown only to the couple / admins (?edit=1). Guests never see it. */
export function AdminBar() {
  const { isAdmin, editMode, setEditMode, resetAll } = useEditMode();
  const [placesOpen, setPlacesOpen] = useState(false);
  if (!isAdmin) return null;

  return (
    <>
      <div
        className="fixed right-3 z-[90] flex flex-col gap-2"
        style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className="inline-flex items-center gap-2 rounded-full border border-champagne/45 bg-ink/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-ivory backdrop-blur-md transition hover:border-champagne"
        >
          {editMode ? <Eye className="size-3.5" /> : <PencilLine className="size-3.5" />}
          {editMode ? "Aperçu invité" : "Mode édition"}
        </button>
        <button
          type="button"
          onClick={() => setPlacesOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-champagne/45 bg-ink/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-ivory backdrop-blur-md transition hover:border-champagne"
        >
          <MapPin className="size-3.5" /> Lieux
        </button>
        {editMode ? (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-full border border-steel/60 bg-ink/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-cloud/75 backdrop-blur-md transition hover:text-ivory"
          >
            <RotateCcw className="size-3.5" /> Tout réinitialiser
          </button>
        ) : null}
      </div>

      <LocationsPanel open={placesOpen} onOpenChange={setPlacesOpen} />
    </>
  );
}

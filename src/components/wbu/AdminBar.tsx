import { useState } from "react";
import { Globe, MapPin, PencilLine, RotateCcw, Eye, MoreHorizontal, LogOut } from "lucide-react";

import { LocationsPanel } from "./LocationsPanel";
import { CouplePanel } from "./CouplePanel";
import { useEditMode } from "./edit-mode";

const chip =
  "inline-flex items-center gap-2 rounded-full border border-champagne/45 bg-ink/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-ivory backdrop-blur-md transition hover:border-champagne";

/** Discreet bar shown only to the couple / admins. Guests never see it. */
export function AdminBar() {
  const { isAdmin, editMode, setEditMode, resetAll, exitAdmin } = useEditMode();
  const [placesOpen, setPlacesOpen] = useState(false);
  const [coupleOpen, setCoupleOpen] = useState(false);
  const [more, setMore] = useState(false);
  if (!isAdmin) return null;

  return (
    <>
      <div
        className="fixed right-3 z-[90] flex flex-col items-end gap-2"
        style={{
          top: "max(0.75rem, env(safe-area-inset-top))",
          display: placesOpen || coupleOpen ? "none" : undefined,
        }}
      >
        <button type="button" onClick={() => setCoupleOpen(true)} className={chip}>
          <Globe className="size-3.5" /> Vos deux pays
        </button>
        <button
          type="button"
          onClick={() => setMore((value) => !value)}
          aria-expanded={more}
          className={chip}
        >
          <MoreHorizontal className="size-3.5" /> {more ? "Fermer" : "Plus"}
        </button>

        {more ? (
          <>
            <button type="button" onClick={() => setPlacesOpen(true)} className={chip}>
              <MapPin className="size-3.5" /> Lieux
            </button>
            <button type="button" onClick={() => setEditMode(!editMode)} className={chip}>
              {editMode ? <Eye className="size-3.5" /> : <PencilLine className="size-3.5" />}
              {editMode ? "Aperçu invité" : "Mode édition"}
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
            <button
              type="button"
              onClick={exitAdmin}
              className="inline-flex items-center gap-2 rounded-full border border-steel/60 bg-ink/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-cloud/75 backdrop-blur-md transition hover:text-ivory"
            >
              <LogOut className="size-3.5" /> Quitter le mode mariés
            </button>
          </>
        ) : null}
      </div>

      <LocationsPanel open={placesOpen} onOpenChange={setPlacesOpen} />
      <CouplePanel open={coupleOpen} onOpenChange={setCoupleOpen} />
    </>
  );
}

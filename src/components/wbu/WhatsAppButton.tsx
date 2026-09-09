import { useEditMode } from "./edit-mode";

/** Digits only — wa.me refuses "+", spaces and dashes. */
export function normalizeWhatsappNumber(value: string): string {
  return (value ?? "").replace(/[^0-9]/g, "");
}

export function whatsappUrl(number: string, message?: string): string {
  const digits = normalizeWhatsappNumber(number);
  const text = (message ?? "").trim();
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/**
 * Discreet floating WhatsApp button for guests.
 * Never rendered when disabled or when no number is configured.
 */
export function WhatsAppButton() {
  const { contactSettings } = useEditMode();
  const digits = normalizeWhatsappNumber(contactSettings.whatsappNumber);
  if (!contactSettings.enabled || digits.length < 6) return null;

  return (
    <a
      href={whatsappUrl(digits, contactSettings.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${contactSettings.label || "WhatsApp"} — contacter les mariés`}
      className="fixed right-3 z-40 inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full border border-champagne/45 bg-ink/75 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-ivory shadow-[0_10px_30px_-12px_rgba(9,20,38,.9)] backdrop-blur-md transition hover:border-champagne hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 4.75rem)" }}
    >
      <WhatsAppGlyph className="size-[18px] shrink-0 text-[#25D366]" />
      <span>{contactSettings.label || "WhatsApp"}</span>
    </a>
  );
}

export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2.4c-5.3 0-9.6 4.3-9.6 9.6 0 1.7.45 3.35 1.3 4.8L2.4 21.6l4.94-1.29a9.56 9.56 0 0 0 4.7 1.22h.01c5.3 0 9.6-4.3 9.6-9.6s-4.3-9.6-9.61-9.53zm5.6 15.13a7.94 7.94 0 0 1-5.6 2.32h-.01c-1.5 0-2.98-.4-4.26-1.17l-.3-.18-2.93.77.78-2.86-.2-.3a7.93 7.93 0 0 1-1.22-4.24c0-4.4 3.58-7.97 7.98-7.97a7.93 7.93 0 0 1 7.97 7.98c0 2.13-.83 4.13-2.21 5.65z" />
    </svg>
  );
}

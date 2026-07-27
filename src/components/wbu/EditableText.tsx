import { useEffect, useRef, type ElementType } from "react";

import { cn } from "@/lib/utils";
import { useEditMode } from "./edit-mode";

type EditableTextProps = {
  /** Stable id — the text override is stored under this key. */
  id: string;
  value: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
};

export function EditableText({
  id,
  value,
  as: Tag = "span",
  className,
  multiline = false,
}: EditableTextProps) {
  const { editMode, getText, setText } = useEditMode();
  const text = getText(id, value);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!editMode && ref.current) ref.current.textContent = text;
  }, [editMode, text]);

  if (!editMode) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      aria-label={`Modifier le texte : ${value}`}
      className={cn(
        "rounded-sm outline-none ring-1 ring-champagne/40 ring-offset-2 ring-offset-transparent transition focus:ring-champagne",
        className,
      )}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          (event.target as HTMLElement).blur();
        }
      }}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        const next = event.currentTarget.textContent?.trim() ?? "";
        setText(id, next.length ? next : null);
      }}
    >
      {text}
    </Tag>
  );
}

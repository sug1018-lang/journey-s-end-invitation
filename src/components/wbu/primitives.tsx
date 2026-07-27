import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className, shown && "wbu-reveal")}
      style={{ opacity: shown ? undefined : 0, animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  overline,
  title,
  subtitle,
  titleId,
  overlineId,
  subtitleId,
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  titleId: string;
  overlineId?: string;
  subtitleId?: string;
}) {
  return (
    <Reveal className="text-center">
      {overline ? (
        <EditableHeadingText id={overlineId ?? `${titleId}-overline`} value={overline} className="overline" />
      ) : null}
      <EditableHeadingText
        id={titleId}
        value={title}
        as="h2"
        className="mt-3 font-display text-[clamp(2rem,8vw,3rem)] font-light leading-[1.1] text-ivory"
      />
      <div className="mx-auto mt-5 h-px w-24 bg-[linear-gradient(90deg,transparent,var(--champagne),transparent)]" />
      {subtitle ? (
        <EditableHeadingText
          id={subtitleId ?? `${titleId}-subtitle`}
          value={subtitle}
          as="p"
          className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-cloud/70"
        />
      ) : null}
    </Reveal>
  );
}

import { EditableText } from "./EditableText";

function EditableHeadingText(props: React.ComponentProps<typeof EditableText>) {
  return <EditableText {...props} />;
}

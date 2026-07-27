import { useEffect, useState } from "react";
import { CalendarDays, Home, Images, Route as RouteIcon, TicketCheck, type LucideIcon } from "lucide-react";

import { worldBetweenUsConfig } from "@/config/worldBetweenUs";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  home: Home,
  route: RouteIcon,
  calendar: CalendarDays,
  images: Images,
  ticket: TicketCheck,
};

export function MobileNav() {
  const items = worldBetweenUsConfig.nav.filter((item) => {
    const sections = worldBetweenUsConfig.sections as Record<string, boolean>;
    return sections[item.id] !== false;
  });

  const [active, setActive] = useState(items[0]?.id ?? "hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.5], rootMargin: "-20% 0px -40% 0px" },
    );
    items.forEach((item) => {
      const node = document.getElementById(item.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-champagne/15 bg-ink/70 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const Icon = icons[item.icon] ?? Home;
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 px-1 py-3 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne",
                  isActive ? "text-champagne" : "text-cloud/55",
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className="truncate text-[9px] uppercase tracking-[0.16em]">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

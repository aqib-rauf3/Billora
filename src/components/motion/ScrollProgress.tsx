"use client";

import { useEffect, useState } from "react";

interface ScrollProgressItem {
  id: string;
  label: string;
}

// Fixed dot-rail showing which stacked panel currently owns the viewport,
// the way Arc/Framer's landing pages orient a visitor mid-scroll-jack
// sequence. Tracks the OUTER (non-sticky) StackedPanel wrappers via
// data-panel-id — an IntersectionObserver watching a thin band at the
// vertical center of the viewport reliably identifies the active one,
// since exactly one wrapper spans that band at any scroll position.
export default function ScrollProgress({ items }: { items: ScrollProgressItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items
      .map((item) => document.querySelector<HTMLElement>(`[data-panel-id="${item.id}"]`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const id = visible.target.getAttribute("data-panel-id");
          if (id) setActive(id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const scrollToPanel = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[60] flex-col items-end gap-3"
      aria-label="Section progress"
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToPanel(item.id)}
          aria-label={`Go to ${item.label}`}
          aria-current={active === item.id}
          className="group flex items-center gap-2"
        >
          <span
            className={[
              "text-xs transition-opacity duration-200 whitespace-nowrap",
              active === item.id ? "opacity-100 text-ink" : "opacity-0 group-hover:opacity-70 text-muted",
            ].join(" ")}
          >
            {item.label}
          </span>
          <span
            className={[
              "rounded-full transition-all duration-300",
              active === item.id ? "w-2.5 h-2.5 bg-orange" : "w-1.5 h-1.5 bg-border group-hover:bg-muted",
            ].join(" ")}
          />
        </button>
      ))}
    </div>
  );
}

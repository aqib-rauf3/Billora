"use client";

import type { MouseEvent, ReactNode, CSSProperties } from "react";

interface GlowCardProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

// Wraps a card so a soft orange spotlight follows the cursor across its
// surface on hover (the Linear/Vercel "border glow" card treatment),
// layered on top of whatever border/shadow classes the card already has.
// Pure CSS custom-property + radial-gradient — no state, no re-renders.
export default function GlowCard({ children, href, className = "" }: GlowCardProps) {
  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  };

  const overlayStyle: CSSProperties = {
    background:
      "radial-gradient(180px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,75,54,0.14), transparent 70%)",
  };

  const overlay = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 group-hover/glow:opacity-100 transition-opacity duration-300"
      style={overlayStyle}
    />
  );

  const sharedClassName = `group group/glow relative overflow-hidden ${className}`;

  if (href) {
    return (
      <a href={href} onMouseMove={handleMove} className={sharedClassName}>
        {overlay}
        {children}
      </a>
    );
  }

  return (
    <div onMouseMove={handleMove} className={sharedClassName}>
      {overlay}
      {children}
    </div>
  );
}

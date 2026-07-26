// Fixed, full-viewport corner glow — sits above the page content (not
// behind it) so the color reads at the screen edges no matter what's
// underneath, including the fully-opaque StackedPanel sections. Kept at
// low opacity + heavy blur so it reads as ambient neon light bleeding in
// from the edges rather than a colored film over the UI. pointer-events:
// none throughout, so it never blocks clicks/taps.
export default function NeonEdgeGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[40vw] h-[40vw] max-w-[420px] max-h-[420px] rounded-full blur-[90px] bg-orange/[0.14]" />
      <div className="absolute -bottom-32 -right-32 w-[40vw] h-[40vw] max-w-[420px] max-h-[420px] rounded-full blur-[90px] bg-navy/[0.16] dark:bg-navyLight/[0.26]" />
    </div>
  );
}

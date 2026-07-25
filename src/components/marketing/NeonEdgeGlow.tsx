// Fixed, full-viewport corner glow — sits above the page content (not
// behind it) so the color reads at the screen edges no matter what's
// underneath, including the fully-opaque StackedPanel sections. Kept at
// low opacity + heavy blur so it reads as ambient neon light bleeding in
// from the edges rather than a colored film over the UI. pointer-events:
// none throughout, so it never blocks clicks/taps.
export default function NeonEdgeGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[60vw] h-[60vw] max-w-[560px] max-h-[560px] rounded-full blur-[120px] bg-orange/[0.16]" />
      <div className="absolute -top-32 -right-32 w-[60vw] h-[60vw] max-w-[560px] max-h-[560px] rounded-full blur-[120px] bg-navy/[0.18] dark:bg-navyLight/[0.28]" />
      <div className="absolute -bottom-32 -left-32 w-[60vw] h-[60vw] max-w-[560px] max-h-[560px] rounded-full blur-[120px] bg-navy/[0.18] dark:bg-navyLight/[0.28]" />
      <div className="absolute -bottom-32 -right-32 w-[60vw] h-[60vw] max-w-[560px] max-h-[560px] rounded-full blur-[120px] bg-orange/[0.16]" />
    </div>
  );
}

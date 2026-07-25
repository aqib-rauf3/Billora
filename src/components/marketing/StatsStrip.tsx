import FadeInSection from "@/components/motion/FadeInSection";

const STATS = [
  { value: "2 min", label: "avg. time to create" },
  { value: "100%", label: "free, no signup wall" },
  { value: "3", label: "currencies supported" },
  { value: "PDF", label: "one-click export" },
];

// Reference: billora_landing_page_v2.html stats strip
export default function StatsStrip() {
  return (
    <FadeInSection>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border max-w-6xl mx-auto">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white p-5 text-center">
            <p className="text-xl font-medium text-navy">{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </section>
    </FadeInSection>
  );
}

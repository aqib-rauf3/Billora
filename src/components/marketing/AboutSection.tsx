import { IconClock, IconLock, IconUsers } from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";

const STATS = [
  { value: "40K+", label: "freelancers onboard" },
  { value: "Rs. 2.1B+", label: "invoiced through Billora" },
  { value: "2024", label: "founded" },
  { value: "Lahore", label: "headquartered" },
];

const VALUES = [
  {
    icon: IconClock,
    title: "Time is billable",
    desc: "Every minute spent formatting invoices is a minute not spent earning.",
  },
  {
    icon: IconLock,
    title: "Your data stays yours",
    desc: "No selling data, no ads. We make money when you get paid faster.",
  },
  {
    icon: IconUsers,
    title: "Built with freelancers",
    desc: "Every feature request comes from real user feedback.",
  },
];

// Reference: billora_about_us_page.html
export default function AboutSection() {
  return (
    <div className="flex-1 flex flex-col justify-center py-16 max-w-6xl mx-auto w-full">
      <FadeInSection>
        <div className="text-center px-7 mb-10">
          <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
            Our story
          </span>
          <h2 className="text-2xl md:text-[28px] font-medium text-ink mb-3 max-w-lg mx-auto">
            Built for freelancers who&apos;d rather work than do paperwork
          </h2>
          <p className="text-sm text-text leading-relaxed max-w-md mx-auto">
            Billora started in 2024 when three freelance developers got tired of spending Friday
            nights formatting invoices instead of getting paid. So we built the tool we wished existed.
          </p>
        </div>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border px-7 mb-10">
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface p-5 text-center">
              <p className="text-xl font-medium text-ink">{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </FadeInSection>

      <div className="px-7">
        <FadeInSection>
          <p className="text-xs tracking-wide text-muted uppercase text-center mb-6">
            What we believe
          </p>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-4">
          {VALUES.map((v, i) => (
            <FadeInSection key={v.title} delay={i * 0.08}>
              <div className="bg-surface rounded-lg p-5 h-full">
                <v.icon size={20} className="text-orange" />
                <p className="text-sm font-medium text-ink mt-2.5 mb-1">{v.title}</p>
                <p className="text-xs text-muted">{v.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
}

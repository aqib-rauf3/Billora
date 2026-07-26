import {
  IconBuildingWarehouse,
  IconPalette,
  IconCoffee,
  IconTruck,
  IconBrush,
  IconShirt,
  IconTruckDelivery,
} from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";

// No real client logo assets exist yet, so this builds proper monochrome
// SVG logomarks (icon + wordmark) for the same fictional sample businesses
// used across Dashboard/Customers (src/lib/mockData.ts), rather than using
// a real company's actual logo without permission — that would falsely
// imply those companies are Billora customers. Marks render muted/
// grayscale by default and reveal a brand-style accent color on hover,
// the "monochrome → color" treatment the request asked for, without
// borrowing anyone else's real mark.
const LOGOS = [
  { name: "Northline Traders", icon: IconBuildingWarehouse, color: "#2E5AAC" },
  { name: "Zara Designs", icon: IconPalette, color: "#C0447A" },
  { name: "Blue Harbor Cafe", icon: IconCoffee, color: "#8B5E34" },
  { name: "Devko Traders", icon: IconTruck, color: "#3A8F5C" },
  { name: "Coral Studio", icon: IconBrush, color: "#E0653C" },
  { name: "Meherbaan Textiles", icon: IconShirt, color: "#7A4FC4" },
  { name: "Prime Logistics", icon: IconTruckDelivery, color: "#1E8FA6" },
];

export default function LogoCloud() {
  const loop = [...LOGOS, ...LOGOS];

  return (
    <FadeInSection>
      <section className="px-7 py-10 max-w-6xl mx-auto">
        <p className="text-xs tracking-wide text-muted uppercase text-center mb-6">
          Trusted by freelancers, agencies, and startups
        </p>

        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max gap-12 animate-[logo-scroll_28s_linear_infinite] motion-reduce:animate-none">
            {loop.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="group flex items-center gap-2 whitespace-nowrap select-none"
                style={{ ["--logo-color" as string]: logo.color }}
              >
                <logo.icon
                  size={20}
                  stroke={1.75}
                  className="text-muted/70 transition-colors duration-300 group-hover:[color:var(--logo-color)]"
                />
                <span className="text-lg font-medium text-muted/70 transition-colors duration-300 group-hover:text-ink">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}

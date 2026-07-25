"use client";

import { useState } from "react";
import { IconMail, IconMessageCircle, IconMapPin } from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";

const CONTACT_METHODS = [
  { icon: IconMail, title: "Email us", detail: "support@billora.app" },
  { icon: IconMessageCircle, title: "Live chat", detail: "Available 9am - 9pm, 7 days" },
  { icon: IconMapPin, title: "Office", detail: "Lahore, Pakistan" },
];

// Reference: billora_contact_us_page.html
// TODO: wire onSubmit to POST /api/contact once an email service (Resend) is connected
export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: replace with real API call
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-20 px-7 py-16 max-w-6xl mx-auto">
      <FadeInSection>
        <div className="text-center mb-10">
          <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
            We reply within a day
          </span>
          <h2 className="text-2xl md:text-[28px] font-medium text-ink mb-2">Get in touch</h2>
          <p className="text-sm text-text">
            Questions about a plan, a bug, or a feature idea? We&apos;d love to hear it.
          </p>
        </div>
      </FadeInSection>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-5">
        <FadeInSection className="flex flex-col gap-3">
          {CONTACT_METHODS.map((m) => (
            <div key={m.title} className="bg-surface rounded-lg p-4 flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-lg bg-redBg flex items-center justify-center flex-shrink-0">
                <m.icon size={16} className="text-orange" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{m.title}</p>
                <p className="text-xs text-muted mt-0.5">{m.detail}</p>
              </div>
            </div>
          ))}
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6">
            <div className="mb-3.5">
              <label className="text-xs text-text block mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB]"
              />
            </div>
            <div className="mb-3.5">
              <label className="text-xs text-text block mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB]"
              />
            </div>
            <div className="mb-4.5">
              <label className="text-xs text-text block mb-1.5">Message</label>
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-navy text-white rounded-md py-2.5 text-sm hover:bg-navyLight transition-colors"
            >
              {sent ? "Message sent ✓" : "Send message"}
            </button>
          </form>
        </FadeInSection>
      </div>
    </section>
  );
}

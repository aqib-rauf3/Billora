"use client";

import { useState } from "react";
import { IconMail, IconMessageCircle, IconMapPin, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import FadeInSection from "@/components/motion/FadeInSection";
import ConfettiBurst from "@/components/motion/ConfettiBurst";

const CONTACT_METHODS = [
  { icon: IconMail, title: "Email us", detail: "support@billora.app" },
  { icon: IconMessageCircle, title: "Live chat", detail: "Available 9am - 9pm, 7 days" },
  { icon: IconMapPin, title: "Office", detail: "Lahore, Pakistan" },
];

type Status = "idle" | "loading" | "success";

// Reference: billora_contact_us_page.html
// TODO: wire onSubmit to POST /api/contact once an email service (Resend) is connected
export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    // TODO: replace with a real API call once /api/contact + an email
    // service are connected.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("success");
    setToast(true);
    setTimeout(() => setToast(false), 3500);
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
          <form onSubmit={handleSubmit} noValidate className="bg-surface rounded-xl p-6">
            <div className="mb-3.5">
              <label className="text-xs text-text block mb-1.5">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full text-sm border rounded-md px-3 py-2 outline-none transition-colors bg-surface ${
                  errors.name ? "border-red" : "border-border focus:border-navy dark:focus:border-[#5B7FDB]"
                }`}
              />
              {errors.name && <p className="text-xs text-red mt-1">{errors.name}</p>}
            </div>
            <div className="mb-3.5">
              <label className="text-xs text-text block mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full text-sm border rounded-md px-3 py-2 outline-none transition-colors bg-surface ${
                  errors.email ? "border-red" : "border-border focus:border-navy dark:focus:border-[#5B7FDB]"
                }`}
              />
              {errors.email && <p className="text-xs text-red mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4.5">
              <label className="text-xs text-text block mb-1.5">Message</label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`w-full text-sm border rounded-md px-3 py-2 outline-none transition-colors resize-none bg-surface ${
                  errors.message ? "border-red" : "border-border focus:border-navy dark:focus:border-[#5B7FDB]"
                }`}
              />
              {errors.message && <p className="text-xs text-red mt-1">{errors.message}</p>}
            </div>
            <div className="relative">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-navy text-white rounded-md py-2.5 text-sm hover:bg-navyLight transition-colors disabled:opacity-70"
              >
                {status === "loading" && <IconLoader2 size={15} className="animate-spin" />}
                {status === "success" && <IconCheck size={15} />}
                {status === "loading" ? "Sending..." : status === "success" ? "Message sent" : "Send message"}
              </button>
              {toast && <ConfettiBurst />}
            </div>
          </form>
        </FadeInSection>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-navy text-white text-sm rounded-full pl-2 pr-4 py-2 shadow-xl"
          >
            <span className="w-6 h-6 rounded-full bg-green flex items-center justify-center flex-shrink-0">
              <IconCheck size={13} />
            </span>
            We&apos;ve got your message — we&apos;ll reply within a day.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

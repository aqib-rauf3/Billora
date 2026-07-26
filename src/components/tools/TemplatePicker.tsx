"use client";

import { IconCheck } from "@tabler/icons-react";
import { INVOICE_TEMPLATES, TemplateId } from "@/lib/invoiceTemplates";

interface TemplatePickerProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

// Small swatch preview for each template's header treatment — reuses the
// same headerStyle vocabulary as DocumentPreviewCard so what you pick here
// actually matches what renders below, per UI_RULES.md ("design decisions
// should always favor clarity").
function Swatch({ headerStyle }: { headerStyle: string }) {
  const base = "w-full h-5 rounded-sm";
  switch (headerStyle) {
    case "mark":
      return (
        <div className="flex items-center gap-1 h-5">
          <span className="w-1 h-3.5 border border-orange border-r-0" />
          <span className="flex-1 h-1 rounded-full bg-border" />
        </div>
      );
    case "hairline":
      return <div className="w-full h-px bg-ink mt-2.5" />;
    case "band":
      return <div className={`${base} bg-orange`} />;
    case "block":
      return <div className={`${base} bg-navy`} />;
    case "compact":
      return (
        <div className="flex flex-col gap-1">
          <div className="w-full h-1.5 rounded-full bg-border" />
          <div className="w-2/3 h-1.5 rounded-full bg-border" />
        </div>
      );
    default:
      return <div className={`${base} bg-border`} />;
  }
}

export default function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  return (
    <div>
      <p className="text-xs text-text mb-2">Template</p>
      <div className="grid grid-cols-5 gap-2">
        {INVOICE_TEMPLATES.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              title={t.description}
              aria-pressed={active}
              className={`relative text-left bg-white rounded-md p-2 border transition-all ${
                active
                  ? "border-navy shadow-[0_0_0_2px_rgba(11,37,69,0.15)]"
                  : "border-border hover:border-[#C7D2F0]"
              }`}
            >
              {active && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-navy text-white flex items-center justify-center">
                  <IconCheck size={9} />
                </span>
              )}
              <Swatch headerStyle={t.headerStyle} />
              <p className="text-[10px] text-ink font-medium mt-1.5 truncate">{t.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { IconX } from "@tabler/icons-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

// Chip-style tag editor — type + Enter/comma to add, click × to remove.
// Used by the Add customer modal and the customer detail page, per
// COMPONENT_GUIDE.md "reuse whenever possible" rather than two versions.
export default function TagInput({ tags, onChange, placeholder = "Add a tag…" }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    if (value && !tags.includes(value)) onChange([...tags, value]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="flex flex-wrap items-center gap-1.5 w-full text-sm border border-border rounded-md px-2.5 py-2 bg-surface focus-within:border-navy dark:focus-within:border-[#5B7FDB] transition-colors">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-bg border border-border text-ink text-xs rounded-full pl-2.5 pr-1.5 py-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
            className="text-muted hover:text-red transition-colors"
          >
            <IconX size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] text-sm outline-none bg-transparent py-0.5"
      />
    </div>
  );
}

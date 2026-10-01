import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      <input
        id={inputId}
        className={`rounded-2xl border border-ink/15 bg-white/70 px-4 py-2.5 text-ink placeholder:text-ink-light/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30 ${className}`}
        {...props}
      />
    </label>
  );
}

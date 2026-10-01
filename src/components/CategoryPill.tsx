interface CategoryPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ label, active = false, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
        active ? "border-ink bg-ink text-cream" : "border-ink/15 bg-white/60 text-ink hover:border-ink/40"
      }`}
    >
      {label}
    </button>
  );
}

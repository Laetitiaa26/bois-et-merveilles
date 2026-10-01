export function NewBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`rounded-full bg-terracotta px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs uppercase tracking-wide text-cream shadow-sm ${className}`}
    >
      Nouveauté
    </span>
  );
}

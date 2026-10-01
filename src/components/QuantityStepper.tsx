interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

export function QuantityStepper({ quantity, onChange, max = 20, min = 1 }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-ink/15 px-2 py-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-semibold text-ink hover:bg-ink/10 disabled:opacity-30"
        aria-label="Diminuer la quantité"
      >
        −
      </button>
      <span className="w-4 text-center text-sm font-semibold">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-semibold text-ink hover:bg-ink/10 disabled:opacity-30"
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
}

import type { ReactElement } from "react";
import type { AccentColor, IllustrationKey } from "../types";

const ACCENT_STYLES: Record<AccentColor, { bg: string; fg: string; fgSoft: string }> = {
  sage: { bg: "bg-sage-light", fg: "text-sage", fgSoft: "text-sage/40" },
  terracotta: { bg: "bg-terracotta-light", fg: "text-terracotta", fgSoft: "text-terracotta/40" },
  mustard: { bg: "bg-mustard-light", fg: "text-mustard", fgSoft: "text-mustard/40" },
  dustypink: { bg: "bg-dustypink-light", fg: "text-dustypink", fgSoft: "text-dustypink/40" },
  sky: { bg: "bg-sky-light", fg: "text-sky", fgSoft: "text-sky/40" },
};

function BlocksIcon() {
  return (
    <g>
      <rect x="24" y="70" width="34" height="34" rx="6" className="fill-current" />
      <rect x="66" y="70" width="34" height="34" rx="6" className="fill-current opacity-70" />
      <rect x="45" y="32" width="34" height="34" rx="6" className="fill-current opacity-85" />
    </g>
  );
}

function NestingBowlsIcon() {
  return (
    <g className="fill-current">
      <path d="M20 78c0 16 18 26 44 26s44-10 44-26z" />
      <path d="M34 70c0 10 13 17 30 17s30-7 30-17z" opacity="0.7" />
      <path d="M46 62c0 6 8 10 18 10s18-4 18-10z" opacity="0.5" />
    </g>
  );
}

function RainbowStackerIcon() {
  return (
    <g fill="none" strokeWidth="12" strokeLinecap="round">
      <path d="M22 98a42 42 0 0 1 84 0" className="stroke-current" />
      <path d="M34 98a30 30 0 0 1 60 0" className="stroke-current opacity-70" />
      <path d="M46 98a18 18 0 0 1 36 0" className="stroke-current opacity-45" />
    </g>
  );
}

function ScarvesIcon() {
  return (
    <g className="fill-current">
      <path d="M26 40c14-14 34-14 42 0 10 14 26 14 36 2-2 20-22 30-40 22-16-8-20 4-38-2-10-4-10-14 0-22z" />
      <circle cx="34" cy="86" r="6" opacity="0.6" />
      <circle cx="54" cy="92" r="5" opacity="0.5" />
      <circle cx="72" cy="86" r="6" opacity="0.6" />
    </g>
  );
}

function SensoryBinIcon() {
  return (
    <g className="fill-current">
      <path d="M22 56h80l-8 46a8 8 0 0 1-8 7H38a8 8 0 0 1-8-7z" />
      <rect x="18" y="46" width="88" height="14" rx="7" opacity="0.75" />
      <circle cx="46" cy="78" r="5" className="fill-cream" />
      <circle cx="64" cy="84" r="4" className="fill-cream" />
      <circle cx="80" cy="76" r="5" className="fill-cream" />
    </g>
  );
}

function VehicleIcon() {
  return (
    <g className="fill-current">
      <path d="M18 78V62a8 8 0 0 1 8-8h20l14-16h20a8 8 0 0 1 8 8v10h4a10 10 0 0 1 10 10v12z" />
      <circle cx="40" cy="84" r="12" className="fill-cream" />
      <circle cx="40" cy="84" r="5" className="fill-current" />
      <circle cx="86" cy="84" r="12" className="fill-cream" />
      <circle cx="86" cy="84" r="5" className="fill-current" />
    </g>
  );
}

function DiscsIcon() {
  return (
    <g className="fill-current">
      <ellipse cx="62" cy="88" rx="34" ry="10" opacity="0.55" />
      <ellipse cx="62" cy="72" rx="34" ry="10" opacity="0.75" />
      <ellipse cx="62" cy="56" rx="34" ry="10" />
    </g>
  );
}

function GemBlocksIcon() {
  return (
    <g className="fill-current">
      <path d="M62 24l26 26-26 52-26-52z" opacity="0.85" />
      <path d="M36 50h52l-26 52z" opacity="0.55" />
    </g>
  );
}

const ICONS: Record<IllustrationKey, () => ReactElement> = {
  blocks: BlocksIcon,
  "nesting-bowls": NestingBowlsIcon,
  "rainbow-stacker": RainbowStackerIcon,
  scarves: ScarvesIcon,
  "sensory-bin": SensoryBinIcon,
  vehicle: VehicleIcon,
  discs: DiscsIcon,
  "gem-blocks": GemBlocksIcon,
};

interface ProductIllustrationProps {
  illustrationKey: IllustrationKey;
  accentColor: AccentColor;
  imageUrl?: string | null;
  alt?: string;
  className?: string;
}

export function ProductIllustration({
  illustrationKey,
  accentColor,
  imageUrl,
  alt = "",
  className = "",
}: ProductIllustrationProps) {
  if (imageUrl) {
    return (
      <div className={`overflow-hidden rounded-[28px] ${className}`}>
        <img src={imageUrl} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
    );
  }

  const Icon = ICONS[illustrationKey] ?? BlocksIcon;
  const styles = ACCENT_STYLES[accentColor] ?? ACCENT_STYLES.sage;

  return (
    <div className={`flex items-center justify-center rounded-[28px] ${styles.bg} ${className}`}>
      <svg viewBox="0 0 124 124" className={`h-2/3 w-2/3 ${styles.fg}`} aria-hidden="true">
        <Icon />
      </svg>
    </div>
  );
}

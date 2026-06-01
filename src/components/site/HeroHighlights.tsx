import { BadgeCheck, Clock, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const TRUST_BADGES = [
  { Icon: ShieldCheck, label: "Trusted", sub: "Licensed recycler" },
  { Icon: BadgeCheck, label: "Guaranteed", sub: "Locked-in offer" },
  { Icon: Zap, label: "Speed", sub: "15-min quote" },
  { Icon: Clock, label: "On Time", sub: "Same-day pickup" },
] as const;

export function HeroHighlights({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="hero-cash-badge relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent px-5 py-3 shadow-[0_0_40px_-8px_oklch(0.72_0.19_47_/_0.75)] backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0 hero-cash-shimmer" aria-hidden />
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/40">
            <span className="font-display text-lg font-bold leading-none">$</span>
          </div>
          <div className="relative leading-tight">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              Instant cash offer
            </p>
            <p className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Up to{" "}
              <span className="text-gradient-orange">$1,000</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Most vehicles • paid on pickup</p>
          </div>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2 sm:gap-2.5">
        {TRUST_BADGES.map(({ Icon, label, sub }) => (
          <li
            key={label}
            className="hero-trust-badge group flex min-w-[7.5rem] flex-1 items-center gap-2.5 rounded-xl border border-border/80 bg-card/55 px-3 py-2.5 backdrop-blur-md transition-colors hover:border-primary/45 hover:bg-card/75 sm:min-w-0 sm:flex-none sm:px-3.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
                {label}
              </span>
              <span className="block truncate text-[10px] text-muted-foreground">{sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroCashRibbon() {
  return (
    <div
      className="hero-cash-ribbon pointer-events-none absolute -right-2 -top-3 z-10 rotate-3 sm:-right-4 sm:-top-4"
      aria-hidden
    >
      <div className="rounded-lg border border-primary/40 bg-primary px-3 py-1.5 text-center shadow-xl shadow-primary/35">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary-foreground/85">
          Up to
        </p>
        <p className="font-display text-xl font-bold leading-none text-primary-foreground">$1,000</p>
      </div>
    </div>
  );
}

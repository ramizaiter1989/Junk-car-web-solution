import { useEffect, useState, type CSSProperties } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export const QUOTE_COUNTDOWN_SECONDS = 30;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function QuoteOfferCountdown() {
  const [remaining, setRemaining] = useState(QUOTE_COUNTDOWN_SECONDS);

  useEffect(() => {
    setRemaining(QUOTE_COUNTDOWN_SECONDS);
    const startedAt = Date.now();

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(0, QUOTE_COUNTDOWN_SECONDS - elapsed));
    };

    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, []);

  const urgent = remaining > 0 && remaining <= 10;
  const finished = remaining === 0;

  const message = finished
    ? "Submit now — your cash offer is still available"
    : urgent
      ? "Hurry! Lock in priority callback before time runs out"
      : remaining <= 20
        ? "You're almost there — finish before the timer ends"
        : "Complete your quote before the timer runs out";

  return (
    <div
      className="shrink-0 border-b border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/30 to-transparent px-5 py-3 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.06)]"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary shadow-[0_0_16px_-2px_oklch(0.72_0.19_47_/_0.5)]",
            urgent && "animate-pulse",
          )}
        >
          <Timer className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-xs font-semibold leading-snug text-foreground",
              urgent && "text-primary",
            )}
          >
            {message}
          </p>
        </div>
        <div
          className={cn(
            "shrink-0 rounded-lg bg-background/90 px-2.5 py-1 font-display text-lg font-bold tabular-nums tracking-tight ring-1 ring-primary/20",
            urgent || finished ? "text-primary shadow-[0_0_14px_-2px_oklch(0.72_0.19_47_/_0.45)]" : "text-foreground",
          )}
          aria-label={`${remaining} seconds remaining`}
        >
          {formatTime(remaining)}
        </div>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted/80 shadow-[inset_0_1px_3px_oklch(0_0_0_/_0.35)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={QUOTE_COUNTDOWN_SECONDS}
        aria-valuenow={remaining}
        aria-label="Time remaining to complete quote"
      >
        <div
          className="quote-countdown-bar h-full w-full origin-left"
          style={
            {
              "--quote-countdown-duration": `${QUOTE_COUNTDOWN_SECONDS}s`,
            } as CSSProperties
          }
        >
          <div
            className={cn(
              "h-full w-full rounded-full bg-primary shadow-[0_0_12px_oklch(0.72_0.19_47_/_0.65)]",
              urgent && "animate-pulse",
            )}
          />
        </div>
      </div>
    </div>
  );
}

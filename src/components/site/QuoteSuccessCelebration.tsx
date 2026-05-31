import { useEffect } from "react";
import { CheckCircle2, PartyPopper, Sparkles } from "lucide-react";
import { celebrateQuoteSubmission } from "@/lib/confetti";
import { cn } from "@/lib/utils";

type QuoteSuccessCelebrationProps = {
  message: string;
  mobile?: boolean;
};

export function QuoteSuccessCelebration({
  message,
  mobile = false,
}: QuoteSuccessCelebrationProps) {
  useEffect(() => {
    celebrateQuoteSubmission();
  }, []);

  return (
    <div
      className={cn(
        "quote-success-celebrate relative overflow-hidden rounded-2xl border border-emerald-500/35 p-8 text-center",
        mobile ? "quote-success-lit" : "bg-primary/10",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="quote-success-sparkle absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-primary/80" />
        <div className="quote-success-sparkle quote-success-sparkle-delay absolute right-[14%] top-[24%] h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <div className="quote-success-sparkle quote-success-sparkle-delay-2 absolute bottom-[22%] left-[18%] h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
        <div className="quote-success-sparkle quote-success-sparkle-delay-3 absolute bottom-[28%] right-[20%] h-2 w-2 rounded-full bg-pink-400/80" />
      </div>

      <div className="relative animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/20 quote-success-pop">
          <CheckCircle2 className="h-11 w-11 text-emerald-500" strokeWidth={2.2} />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-primary">
          <PartyPopper className="h-5 w-5 quote-success-wiggle" aria-hidden />
          <Sparkles className="h-5 w-5 quote-success-wiggle quote-success-wiggle-delay" aria-hidden />
        </div>

        <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
          Congratulations!
        </h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-500">
          Quote sent successfully
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {message ||
            "One of our buyers will call you within 15 minutes with a guaranteed cash offer."}
        </p>
      </div>
    </div>
  );
}

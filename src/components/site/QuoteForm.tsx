import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/40 bg-primary/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 font-display text-xl font-bold">Quote request received!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          One of our buyers will call you within 15 minutes with a guaranteed cash offer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
      <input required name="name" placeholder="Full name" className="rounded-md border border-input bg-secondary/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <input required type="tel" name="phone" placeholder="Phone number" className="rounded-md border border-input bg-secondary/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <input required name="year" placeholder="Year" className="rounded-md border border-input bg-secondary/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <input required name="make" placeholder="Make (e.g. Ford)" className="rounded-md border border-input bg-secondary/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <input required name="model" placeholder="Model" className={`rounded-md border border-input bg-secondary/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${compact ? "" : "sm:col-span-2"}`} />
      <input required name="zip" placeholder="ZIP code" className={`rounded-md border border-input bg-secondary/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${compact ? "" : "sm:col-span-2"}`} />
      <textarea name="notes" placeholder="Condition / notes (optional)" rows={3} className={`rounded-md border border-input bg-secondary/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${compact ? "" : "sm:col-span-2"}`} />
      <button disabled={loading} type="submit" className={`inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-60 ${compact ? "" : "sm:col-span-2"}`}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Get My Instant Cash Offer
      </button>
      <p className={`text-[11px] text-muted-foreground text-center ${compact ? "" : "sm:col-span-2"}`}>
        By submitting you agree to be contacted about your vehicle. No spam — guaranteed.
      </p>
    </form>
  );
}

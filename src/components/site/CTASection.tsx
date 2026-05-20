import { Phone, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSiteBusiness } from "@/lib/use-site-business";

export function CTASection({
  title = "Ready to turn that junk car into cash?",
  subtitle = "Free towing, same-day pickup, and a guaranteed cash offer across all of Michigan.",
}: { title?: string; subtitle?: string }) {
  const business = useSiteBusiness();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-20">
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-12">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">{title}</h2>
            <p className="mt-3 text-muted-foreground max-w-xl">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={business.primaryPhoneHref} className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform">
              <Phone className="h-4 w-4" /> Call {business.primaryPhone}
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-secondary">
              Get Instant Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

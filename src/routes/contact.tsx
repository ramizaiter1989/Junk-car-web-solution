import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import { BUSINESS } from "@/lib/business";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Wayne Automotive Recyclers LLC | Junk Car Quotes Michigan" },
      { name: "description", content: "Contact Wayne Automotive Recyclers in Wayne, MI for instant junk car quotes, free towing, and used auto parts. Call 313-500-6233 or 313-286-6491." },
      { property: "og:title", content: "Contact Wayne Automotive Recyclers" },
      { property: "og:description", content: "Get an instant cash quote for your junk car or schedule free pickup in Michigan." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let&apos;s get you a cash offer."
        subtitle="Call us, request a quote online, or stop by our Wayne, Michigan yard — whichever is easiest."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <a href={BUSINESS.primaryPhoneHref} className="block rounded-xl border border-border bg-card p-6 hover:border-primary/60 transition-colors">
              <Phone className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-display text-xl font-bold">Call us anytime</h3>
              <p className="mt-1 text-muted-foreground">{BUSINESS.phones[0]}</p>
              <p className="text-muted-foreground">{BUSINESS.phones[1]}</p>
            </a>
            <div className="rounded-xl border border-border bg-card p-6">
              <MapPin className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-display text-xl font-bold">Visit our yard</h3>
              <p className="mt-1 text-muted-foreground">{BUSINESS.address.full}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Clock className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-display text-xl font-bold">Hours</h3>
              <p className="mt-1 text-muted-foreground">{BUSINESS.hours}</p>
            </div>
            <a href={`mailto:${BUSINESS.email}`} className="block rounded-xl border border-border bg-card p-6 hover:border-primary/60 transition-colors">
              <Mail className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-display text-xl font-bold">Email</h3>
              <p className="mt-1 text-muted-foreground">{BUSINESS.email}</p>
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/30">
            <h3 className="font-display text-2xl font-bold">Request your free quote</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">We&apos;ll call you back within 15 minutes with a guaranteed cash offer.</p>
            <QuoteForm />
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border overflow-hidden h-[420px] bg-card">
          <iframe
            title="Wayne Automotive Recyclers location"
            src="https://www.google.com/maps?q=36597+Annapolis,+Wayne,+MI&output=embed"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { Truck, Clock, MapPin, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/junk-car-removal")({
  head: () => ({
    meta: [
      { title: "Free Junk Car Removal in Wayne MI | Same-Day Pickup | Wayne Auto Recyclers" },
      { name: "description", content: "Free junk car removal in Wayne, Michigan and all of Metro Detroit. Same-day pickup, no hidden fees, top cash paid on the spot. Call 313-500-6233." },
      { property: "og:title", content: "Free Junk Car Removal Wayne MI — Same-Day Pickup" },
      { property: "og:description", content: "We tow your junk car for free and pay you cash on the spot. Serving all of Michigan." },
      { property: "og:url", content: "/junk-car-removal" },
    ],
    links: [{ rel: "canonical", href: "/junk-car-removal" }],
  }),
  component: RemovalPage,
});

function RemovalPage() {
  return (
    <>
      <PageHero
        eyebrow="Junk Car Removal"
        title="Free junk car removal — anywhere in Michigan."
        subtitle="Same-day tow trucks. Friendly drivers. Zero pickup fees. We make scrap car removal effortless from Wayne to Detroit to Ann Arbor."
        crumbs={[{ label: "Home", to: "/" }, { label: "Junk Car Removal" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Truck, t: "Always free towing", d: "Tow fees are always covered by us — no deduction from your offer." },
            { Icon: Clock, t: "Same-day pickup", d: "Most pickups happen within hours of accepting your quote." },
            { Icon: MapPin, t: "Statewide coverage", d: "Wayne, Metro Detroit, Ann Arbor, Downriver, and surrounding areas." },
            { Icon: ShieldCheck, t: "Licensed haulers", d: "All drivers fully insured and trained for safe non-running vehicle removal." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">How junk car removal works</h2>
          <ol className="mt-6 space-y-4 text-muted-foreground">
            <li><strong className="text-foreground">1. Call us or request a quote online.</strong> Tell us your vehicle&apos;s year, make, model, condition, and ZIP code.</li>
            <li><strong className="text-foreground">2. Lock in your guaranteed offer.</strong> We&apos;ll quote you within minutes — no haggling, no bait-and-switch.</li>
            <li><strong className="text-foreground">3. We schedule pickup at your convenience.</strong> Same day in most cases, including evenings and Saturdays.</li>
            <li><strong className="text-foreground">4. Driver arrives, you get paid cash.</strong> Title transfer happens on-site, and your junk car is gone.</li>
          </ol>

          <h2 className="mt-12 font-display text-3xl font-bold">Scrap car removal Michigan — done right.</h2>
          <p className="mt-3 text-muted-foreground">
            From abandoned vehicles in your driveway to fleet write-offs, we provide professional scrap vehicle removal for residential, commercial, and municipal clients across Michigan. We handle the title work, DMV notification, and EPA-compliant disposal so you don&apos;t have to think about it again.
          </p>
        </div>
      </section>

      <CTASection title="Need that junker gone today?" subtitle="Free towing, same-day pickup, top cash — call us right now." />
    </>
  );
}

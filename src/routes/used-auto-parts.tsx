import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import partsImg from "@/assets/used-parts.jpg";
import { callInMeta } from "@/lib/business";
import { useSiteBusiness } from "@/lib/use-site-business";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/used-auto-parts")({
  head: ({ match }) => ({
    meta: [
      { title: "Used Auto Parts Michigan | Tested & Warrantied | Wayne Auto Recyclers" },
      {
        name: "description",
        content: callInMeta(
          "Quality used auto parts in Michigan — engines, transmissions, body panels, electronics. Tested, warrantied, and ready to ship. Call 313-500-6233.",
          match.context.business,
        ),
      },
      { property: "og:title", content: "Used Auto Parts Michigan | Wayne Automotive Recyclers" },
      { property: "og:description", content: "Save up to 70% vs new with tested used auto parts from Michigan&apos;s trusted recycler." },
      { property: "og:url", content: "/used-auto-parts" },
    ],
    links: [{ rel: "canonical", href: "/used-auto-parts" }],
  }),
  component: PartsPage,
});

function PartsPage() {
  const business = useSiteBusiness();
  return (
    <>
      <PageHero
        eyebrow="Used Auto Parts"
        title="Quality used auto parts — Michigan&apos;s trusted source."
        subtitle="Save up to 70% vs. new. Every part is inspected, tested, and backed by our warranty. Local pickup or nationwide shipping."
        crumbs={[{ label: "Home", to: "/" }, { label: "Used Auto Parts" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Huge inventory. Honest people. Real warranties.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our Wayne, MI warehouse is stocked with thousands of tested used auto parts pulled from late-model vehicles processed in our recycling yard. Whether you&apos;re a DIY weekend mechanic, an independent shop, or a body shop fleet — we&apos;ve got the parts you need at a fraction of dealer pricing.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {[
                "Engines & long blocks",
                "Transmissions (auto & manual)",
                "Doors, hoods, fenders, bumpers",
                "Headlights, taillights, mirrors",
                "Wheels, tires & rims",
                "Catalytic converters & exhaust",
                "Alternators, starters, ECUs",
                "Interior trim & seats",
              ].map((i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" /><span>{i}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Can&apos;t find your part? Call <strong className="text-foreground">{business.primaryPhone}</strong> — we source parts daily across our network of Michigan auto recyclers.
            </p>
          </div>
          <img src={partsImg} alt="Warehouse of used auto parts for sale at Wayne Automotive Recyclers in Michigan" width={1280} height={896} loading="lazy" className="rounded-2xl border border-border shadow-2xl shadow-black/40" />
        </div>
      </section>

      <CTASection title="Need a specific part?" subtitle="Call our parts team — most requests are answered within minutes." />
    </>
  );
}

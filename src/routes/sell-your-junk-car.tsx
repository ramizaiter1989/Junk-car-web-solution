import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { OpenQuoteButton } from "@/components/site/OpenQuoteButton";
import { CTASection } from "@/components/site/CTASection";
import { callInMeta } from "@/lib/business";
import { brandTitle, buildPageHead } from "@/lib/seo";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/sell-your-junk-car")({
  head: ({ match }) => {
    const { business, site } = match.context;
    return buildPageHead({
      path: "/sell-your-junk-car",
      title: brandTitle(
        "Sell My Junk Car in Michigan | Instant Cash Offer | Wayne Auto Recyclers",
        "Sell My Junk Car in Michigan | Instant Cash Offer | Michigan Junk Cars",
        site,
      ),
      description: callInMeta(
        "Sell your junk car in Michigan for top cash. Free same-day towing, instant guaranteed offers, and easy paperwork. Call today.",
        business,
      ),
      business,
      site,
      ogTitle: "Sell Your Junk Car in Michigan — Instant Cash Offer",
      ogDescription: "Get the most cash for your junk car in Michigan. Free towing and same-day pickup.",
    });
  },
  component: SellPage,
});

function SellPage() {
  return (
    <>
      <PageHero
        eyebrow="Sell Your Junk Car"
        title="Sell my junk car — for top cash, today."
        subtitle="Skip Craigslist headaches and lowball tow operators. Get a guaranteed cash offer for your junk, damaged, or unwanted car in minutes."
        crumbs={[{ label: "Home", to: "/" }, { label: "Sell Your Junk Car" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl font-bold">We buy every kind of junk car in Michigan</h2>
            <p className="mt-3 text-muted-foreground">
              Wayne Automotive Recyclers buys cars, trucks, SUVs, vans, and motorcycles in any condition. Whether your vehicle is running, wrecked, flooded, or has been parked for years — we want it, and we&apos;ll pay you top cash.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {[
                "Junk cars & non-running vehicles",
                "Wrecked & accident-damaged cars",
                "Cars with blown engines or transmissions",
                "Flood, fire, or storm damage",
                "Cars without titles (in many cases)",
                "Vehicles that failed emissions",
                "Old cars and unwanted classics",
                "Fleet & commercial vehicles",
              ].map((i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-display text-2xl font-bold">What affects your offer?</h3>
            <p className="mt-3 text-muted-foreground">
              We base our junk car offers on year, make, model, weight, condition, salvageable parts, location, and current scrap metal prices in Michigan. Because we recycle in-house, we can almost always beat tow-and-flip operators and out-of-state buyers.
            </p>
            <p className="mt-3 text-muted-foreground">
              Want to maximize your offer? Have your title ready, share accurate condition details, and let us know about any aftermarket or premium parts (catalytic converter, wheels, audio, etc.).
            </p>
          </div>
          <aside>
            <div className="lg:sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/30">
              <h3 className="font-display text-2xl font-bold">Get my offer</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-5">30 seconds. Guaranteed price.</p>
              <OpenQuoteButton size="lg" trackLabel="Get Quote — Sell page" />
            </div>
          </aside>
        </div>
      </section>

      <CTASection title="Don&apos;t let that junk car sit another day." subtitle="Call now for an instant offer — and we&apos;ll have it gone before sundown." />
    </>
  );
}

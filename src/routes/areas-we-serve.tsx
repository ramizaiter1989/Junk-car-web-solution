import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { brandTitle, buildPageHead } from "@/lib/seo";
import { useSiteBusiness } from "@/lib/use-site-business";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/areas-we-serve")({
  head: ({ match }) => {
    const { business, site } = match.context;
    return buildPageHead({
      path: "/areas-we-serve",
      title: brandTitle(
        "Areas We Serve | Junk Car Buyers in Michigan | Wayne Auto Recyclers",
        "Areas We Serve | Junk Car Buyers in Michigan | Michigan Junk Cars",
        site,
      ),
      description: site.isMichiganJunkCars
        ? "Michigan Junk Cars buys vehicles statewide: Detroit, Wayne County, Ann Arbor, Lansing, Grand Rapids, Flint, and surrounding communities."
        : "Wayne Automotive Recyclers buys junk cars across Wayne County and Metro Detroit: Detroit, Dearborn, Livonia, Westland, Canton, Romulus, Ann Arbor and more.",
      business,
      site,
      ogTitle: "Areas We Serve | Michigan Junk Car Buyers",
      ogDescription: site.isMichiganJunkCars
        ? "Free junk car removal across Michigan."
        : "Free junk car removal across Wayne County and Metro Detroit.",
    });
  },
  component: AreasPage,
});

function AreasPage() {
  const business = useSiteBusiness();
  return (
    <>
      <PageHero
        eyebrow="Areas We Serve"
        title="Junk car buyers across Michigan."
        subtitle="From Wayne to Detroit to Ann Arbor, we provide free junk car removal and cash offers everywhere in our service area."
        crumbs={[{ label: "Home", to: "/" }, { label: "Areas We Serve" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl font-bold">Cities we buy junk cars in</h2>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          Wayne Automotive Recyclers proudly buys junk cars, removes scrap vehicles, and supplies used auto parts across Wayne County and most of Metro Detroit. Don&apos;t see your city? Give us a call. Chances are we cover you too.
        </p>

        <div className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {business.serviceArea.map((c) => (
            <div key={c} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-colors">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-semibold">{c}, MI</span>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-card/40 p-8">
          <h3 className="font-display text-2xl font-bold">Headquartered in Wayne, Michigan</h3>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Our central Wayne, MI yard at <strong className="text-foreground">{business.address.full}</strong> sits just minutes from I-94, I-275, and Michigan Avenue, giving our tow trucks fast access to nearly every Metro Detroit zip code.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import yardImg from "@/assets/recycling-yard.jpg";
import { callInMeta } from "@/lib/business";
import { brandTitle, buildPageHead } from "@/lib/seo";
import { Recycle, Droplets, Cog, Factory } from "lucide-react";

export const Route = createFileRoute("/auto-recycling-services")({
  head: ({ match }) => {
    const { business, site } = match.context;
    return buildPageHead({
      path: "/auto-recycling-services",
      title: brandTitle(
        "Auto Recycling Services Michigan | EPA-Compliant | Wayne Auto Recyclers",
        "Auto Recycling Services Michigan | EPA-Compliant | Michigan Junk Cars",
        site,
      ),
      description: callInMeta(
        "Certified automotive recycling services in Michigan. EPA-compliant fluid recovery, parts reclamation, and scrap metal processing.",
        business,
      ),
      business,
      site,
      ogTitle: brandTitle(
        "Auto Recycling Services Michigan | Wayne Automotive Recyclers",
        "Auto Recycling Services Michigan | Michigan Junk Cars",
        site,
      ),
      ogDescription: "Licensed Michigan auto recycling company — eco-friendly, EPA-compliant, full-service.",
    });
  },
  component: RecyclingPage,
});

function RecyclingPage() {
  return (
    <>
      <PageHero
        eyebrow="Auto Recycling Services"
        title="Certified automotive recycling — done responsibly."
        subtitle="As a licensed Michigan automotive recycling company, we process every vehicle in-house using EPA-compliant procedures. Over 80% of each car is reused or recycled."
        crumbs={[{ label: "Home", to: "/" }, { label: "Auto Recycling Services" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
          <img src={yardImg} alt="Wayne Automotive Recyclers Michigan auto recycling yard with crushed cars" width={1600} height={1024} loading="lazy" className="rounded-2xl border border-border shadow-2xl shadow-black/40" />
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">A full-service automotive recycling company.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From the moment a vehicle arrives at our Wayne, MI yard, it&apos;s drained, depolluted, and dismantled following strict environmental guidelines. Reusable parts are inventoried for resale, hazardous fluids are recovered, and the remaining hulk is crushed and processed for scrap metal recycling.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              This in-house process is what allows us to pay more cash for junk cars than tow services or middlemen — and to do it with a clean environmental conscience.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Droplets, t: "Fluid recovery", d: "Oil, coolant, fuel, refrigerant, and brake fluid are safely captured and recycled." },
            { Icon: Cog, t: "Parts reclamation", d: "Engines, transmissions, body panels, electronics, and more — tested and resold." },
            { Icon: Factory, t: "Scrap metal processing", d: "Steel, aluminum, and copper recovered and sent to U.S. mills for new production." },
            { Icon: Recycle, t: "Tire & battery recycling", d: "End-of-life tires and lead-acid batteries diverted from landfills." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection title="Partner with a real automotive recycler." subtitle="Insurance write-offs, fleet end-of-life, dealer trade-ins — we handle volume." />
    </>
  );
}

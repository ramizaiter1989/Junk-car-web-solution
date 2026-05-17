import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import yardImg from "@/assets/recycling-yard.jpg";
import { Recycle, ShieldCheck, Users, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Wayne Automotive Recyclers LLC | Michigan Auto Recycling Company" },
      { name: "description", content: "Learn about Wayne Automotive Recyclers LLC — a licensed Michigan auto recycling company buying junk cars and supplying used auto parts since 2009." },
      { property: "og:title", content: "About Wayne Automotive Recyclers LLC" },
      { property: "og:description", content: "Michigan&apos;s trusted, licensed automotive recycling company based in Wayne, MI." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A Michigan-grown automotive recycling company."
        subtitle="Wayne Automotive Recyclers LLC has spent over a decade helping Michigan drivers turn unwanted vehicles into cash — responsibly, transparently, and at top dollar."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
          <img src={yardImg} alt="Wayne Automotive Recyclers junkyard and auto salvage facility in Wayne, Michigan" width={1600} height={1024} loading="lazy" className="rounded-2xl border border-border shadow-2xl shadow-black/40" />
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Built on trust, fueled by Michigan.</h2>
            <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded and operated in Wayne, Michigan, Wayne Automotive Recyclers LLC is a fully licensed automotive recycling company serving Wayne County, Metro Detroit, and the surrounding Michigan communities. We&apos;ve built our reputation paying top cash for junk cars while running an EPA-compliant, environmentally responsible recycling yard.
              </p>
              <p>
                We&apos;re not a tow service that flips cars to junkyards. We <em className="text-foreground">are</em> the junkyard. That means we cut out the middleman, give our customers more money, and process every vehicle in-house — from drain-down and fluid recovery, to part recovery, to scrap metal recycling.
              </p>
              <p>
                Whether you&apos;re looking to sell your junk car, source a tested used auto part, or schedule scrap vehicle removal anywhere in Michigan, our crew is here seven days a week to make it simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">What we stand for</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: ShieldCheck, t: "Honest pricing", d: "Guaranteed quotes, no haggling, no surprises at pickup." },
              { Icon: Recycle, t: "Responsible recycling", d: "EPA-compliant processing. Over 80% of each vehicle reused or recycled." },
              { Icon: Users, t: "Local & accountable", d: "Wayne-based, family-owned, and proud to serve Michigan drivers." },
              { Icon: Award, t: "Top-rated service", d: "4.9-star average rating across hundreds of Michigan customers." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="rounded-xl border border-border bg-card p-6">
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

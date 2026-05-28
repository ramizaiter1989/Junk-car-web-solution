import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { brandTitle, buildPageHead } from "@/lib/seo";

const faqs = [
  { q: "How much can I get for my junk car in Michigan?", a: "Most junk cars in Michigan sell between $200 and $5,000 depending on year, make, model, weight, and condition. We pay the highest local rates and offer guaranteed phone quotes in minutes." },
  { q: "Is towing really free?", a: "Yes. Free junk car towing is included with every offer we make. There are no hidden fees or pickup charges deducted at the time of sale." },
  { q: "How fast can you pick up my junk car?", a: "Most pickups happen the same day you call, often within 1–3 hours of accepting your offer." },
  { q: "Do I need a title to sell my junk car?", a: "A title is preferred, but not always required. In many cases we can purchase your vehicle with just your driver's license and current registration. Call us to confirm your options." },
  { q: "What if my car doesn't run?", a: "No problem at all — we buy non-running, wrecked, damaged, and totaled cars every single day. That's our specialty." },
  { q: "What vehicles do you buy?", a: "Cars, trucks, SUVs, vans, and motorcycles. Any make, model, or year. Running or not. Damaged, flooded, fire, or unwanted." },
  { q: "Do you buy fleet or commercial vehicles?", a: "Yes. We work with insurance companies, fleet managers, dealers, and municipalities on volume removals across Michigan." },
  { q: "How do I get paid?", a: "Cash on the spot at the time of pickup. We can also pay by check on request." },
  { q: "Where do you buy junk cars?", a: "Anywhere in Wayne County and Metro Detroit — including Wayne, Westland, Detroit, Dearborn, Livonia, Romulus, Canton, Ann Arbor, and surrounding areas." },
  { q: "What happens to my car after pickup?", a: "It's taken to our licensed Wayne, MI recycling yard, drained of fluids, depolluted, dismantled for reusable parts, then crushed and processed for scrap metal — all under EPA-compliant procedures." },
  { q: "Do you sell used auto parts?", a: "Yes. Our Wayne facility carries thousands of tested, warrantied used auto parts. Call our parts team or visit the Used Auto Parts page." },
];

export const Route = createFileRoute("/faq")({
  head: ({ match }) => {
    const { business, site } = match.context;
    return {
    ...buildPageHead({
      path: "/faq",
      title: brandTitle(
        "Junk Car FAQ Michigan | Wayne Automotive Recyclers LLC",
        "Junk Car FAQ Michigan | Michigan Junk Cars",
        site,
      ),
      description:
        "Answers to the most common questions about selling junk cars in Michigan — pricing, towing, titles, pickup speed, and more.",
      business,
      site,
      ogTitle: brandTitle("Junk Car FAQ — Wayne Automotive Recyclers", "Junk Car FAQ — Michigan Junk Cars", site),
      ogDescription: "Pricing, towing, paperwork, and pickup — all your junk car questions answered.",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(f => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  };
  },
  component: FAQPage,
});

function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Junk car questions, answered."
        subtitle="Everything you need to know about selling your junk car in Michigan."
        crumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
      />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-xl border border-border bg-card open:border-primary/40 transition-colors">
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                <span className="font-semibold pr-4">{f.q}</span>
                <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}

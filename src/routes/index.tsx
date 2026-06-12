import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone, ArrowRight, DollarSign, Truck, Recycle, Wrench,
  Clock, ShieldCheck, MapPin, Star, CheckCircle2, Car, FileCheck, HandCoins
} from "lucide-react";
import heroImg from "@/assets/hero-tow.jpg";
import yardImg from "@/assets/recycling-yard.jpg";
import cashImg from "@/assets/cash-handoff.jpg";
import { callInMeta } from "@/lib/business";
import { brandTitle, buildPageHead } from "@/lib/seo";
import { useSiteBusiness } from "@/lib/use-site-business";
import { OpenQuoteButton } from "@/components/site/OpenQuoteButton";
import { useQuotePopup } from "@/components/site/QuotePopupContext";
import { trackCallAttrs, trackQuoteAttrs } from "@/lib/website-tracking";
import { CTASection } from "@/components/site/CTASection";
import { HeroCashRibbon, HeroHighlights } from "@/components/site/HeroHighlights";

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const { business, site } = match.context;
    const title = brandTitle(
      "Cash For Junk Cars in Michigan | Wayne Automotive Recyclers LLC",
      "Cash For Junk Cars in Michigan | Michigan Junk Cars",
      site,
    );
    return {
    ...buildPageHead({
      path: "/",
      title,
      description: callInMeta(
        site.isMichiganJunkCars
          ? "Get top cash for your junk car in Michigan. Michigan Junk Cars offers free same-day towing, instant guaranteed offers, and trusted recycling statewide. Call today."
          : "Get top cash for your junk car in Michigan. Wayne Automotive Recyclers offers free same-day towing, instant quotes, and trusted auto recycling. Call 313-500-6233.",
        business,
      ),
      business,
      site,
      ogTitle: brandTitle(
        "Cash For Junk Cars in Michigan | Wayne Automotive Recyclers",
        "Cash For Junk Cars in Michigan | Michigan Junk Cars",
        site,
      ),
      ogDescription:
        "Free towing. Instant offers. Top cash for junk, damaged, and unwanted vehicles across Michigan.",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "How much can I get for my junk car in Michigan?", acceptedAnswer: { "@type": "Answer", text: "Most junk cars in Michigan sell between $200 and $5,000 depending on year, make, model, weight, and condition. We pay the highest local rates and offer guaranteed price quotes by phone." } },
            { "@type": "Question", name: "Do you offer free junk car towing?", acceptedAnswer: { "@type": "Answer", text: "Yes, free same-day towing is included with every offer across Wayne County and Metro Detroit." } },
            { "@type": "Question", name: "Do I need a title to sell my junk car?", acceptedAnswer: { "@type": "Answer", text: "A title is preferred but not always required. Call us. In many cases we can still buy your vehicle with just your ID and registration." } },
          ],
        }),
      },
    ],
  };
  },
  component: HomePage,
});

function HomePage() {
  const business = useSiteBusiness();
  const { openQuotePopup } = useQuotePopup();
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Flatbed tow truck loading a junk car at a Michigan automotive recycling yard"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Michigan&apos;s #1 Junk Car Buyers
              </div>
              <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Cash For Junk Cars{" "}
                <span className="text-gradient-orange">in Michigan</span>
              </h1>

              <HeroHighlights className="mt-6" />

              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Get a guaranteed instant cash offer for your junk, damaged, or unwanted vehicle.
                <strong className="text-foreground"> Free same-day towing</strong> across Wayne, metro Detroit, and all of Michigan.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={business.primaryPhoneHref}
                  {...trackCallAttrs("Hero", business.primaryPhone)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
                >
                  <Phone className="h-4 w-4" /> Call Now • {business.primaryPhone}
                </a>
                <button
                  type="button"
                  {...trackQuoteAttrs("Hero")}
                  onClick={(event) => openQuotePopup(event.currentTarget)}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 backdrop-blur px-6 py-4 text-sm font-bold uppercase tracking-wider hover:bg-secondary"
                >
                  Get Instant Quote <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { v: "15k+", l: "Cars Recycled" },
                  { v: "$5M+", l: "Paid Out" },
                  { v: "4.9★", l: "Avg Rating" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg border border-border bg-card/60 backdrop-blur px-4 py-3 text-center">
                    <dt className="font-display text-2xl font-bold text-primary">{s.v}</dt>
                    <dd className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div id="quote" className="relative">
              <HeroCashRibbon />
              <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-xl p-6 shadow-2xl shadow-black/40">
                <div className="flex items-center gap-2 mb-2 text-primary text-xs font-bold uppercase tracking-widest">
                  <DollarSign className="h-4 w-4" /> Instant Cash Offer
                </div>
                <h2 className="font-display text-2xl font-bold">Get your guaranteed quote</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Finish before the timer runs out and get $100+ added to your price.
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  You&apos;ll get the highest price on the market.
                </p>
                <ul className="mb-6 mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Free same-day towing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Cash on the spot
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> No title? We can help
                  </li>
                </ul>
                <OpenQuoteButton size="lg" trackLabel="Get Quote: Home form card" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { Icon: DollarSign, t: "Top Cash Paid" },
              { Icon: Truck, t: "Free Same-Day Towing" },
              { Icon: ShieldCheck, t: "Licensed & Insured" },
              { Icon: Recycle, t: "EPA-Compliant Recycling" },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex items-center justify-center gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">What We Do</div>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Junk car services across Michigan</h2>
          <p className="mt-3 text-muted-foreground">From sell-your-car to full vehicle recycling, Wayne Automotive Recyclers handles every step: fast, fair, and EPA-compliant.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: HandCoins, t: "Sell Your Junk Car", d: "Top cash offers for junk, damaged, and unwanted cars across Michigan.", to: "/sell-your-junk-car" },
            { Icon: Truck, t: "Free Junk Car Removal", d: "Same-day pickup and free towing anywhere in Wayne County.", to: "/junk-car-removal" },
            { Icon: Recycle, t: "Auto Recycling", d: "Certified, eco-friendly automotive recycling and scrap metal processing.", to: "/auto-recycling-services" },
            { Icon: Wrench, t: "Used Auto Parts", d: "Tested, warrantied used auto parts for cars and trucks, shipped or in-store.", to: "/used-auto-parts" },
          ].map(({ Icon, t, d, to }) => (
            <Link key={t} to={to} className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/60 hover:bg-card/80 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center">
            <div>
              <img
                src={cashImg}
                alt="Wayne Automotive Recyclers paying instant cash for a junk car in Michigan"
                width={1280}
                height={896}
                loading="lazy"
                className="rounded-2xl border border-border shadow-2xl shadow-black/40"
              />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">How It Works</div>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Sell your junk car in 3 easy steps</h2>
              <ol className="mt-8 space-y-6">
                {[
                  { n: "01", Icon: Phone, t: "Tell us about your car", d: `Call ${business.primaryPhone} or submit our 30-second form with your vehicle details and ZIP code.` },
                  { n: "02", Icon: DollarSign, t: "Get your instant cash offer", d: "We&apos;ll respond within 15 minutes with a guaranteed top-dollar quote. No haggling." },
                  { n: "03", Icon: Truck, t: "Free pickup, instant cash", d: "We tow your junk car for free, often same-day, and pay you cash on the spot." },
                ].map(({ n, Icon, t, d }) => (
                  <li key={n} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="relative">
                        <div className="h-14 w-14 rounded-lg bg-primary/15 grid place-items-center text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px] font-bold">{n}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">{t}</h3>
                      <p className="mt-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: d }} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">Why Choose Us</div>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Michigan&apos;s most trusted automotive recyclers</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { Icon: DollarSign, t: "Top-Dollar Offers", d: "We pay more than competitors because we recycle in-house. No middlemen." },
            { Icon: Clock, t: "Same-Day Service", d: "Most pickups happen the same day you call. Often within 2 hours." },
            { Icon: Truck, t: "Always Free Towing", d: "Free junk car towing is included in every offer, anywhere in our service area." },
            { Icon: ShieldCheck, t: "Licensed & Insured", d: "Fully licensed Michigan auto recycler with proper insurance and EPA compliance." },
            { Icon: Recycle, t: "Eco-Friendly Recycling", d: "Over 80% of every vehicle we process is recycled or reused responsibly." },
            { Icon: FileCheck, t: "Easy Paperwork", d: "We handle the title transfer paperwork and DMV notification for you." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Customer Reviews</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">What Michigan drivers are saying</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "Marcus T.", c: "Wayne, MI", q: "Called at 9 AM, had cash in my hand by noon. Most painless way I&apos;ve ever sold a car. The price beat every other quote I got." },
              { n: "Jasmine R.", c: "Detroit, MI", q: "My old Camry wouldn&apos;t start and was just rotting in the driveway. They towed it for free and paid $450 cash. Super friendly crew." },
              { n: "Dave K.", c: "Livonia, MI", q: "Honest, fast, and they handled all the paperwork. I&apos;ll recommend Wayne Automotive Recyclers to anyone with a junker." },
            ].map((r) => (
              <figure key={r.n} className="rounded-xl border border-border bg-card p-6">
                <div className="flex text-primary">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-3 text-sm text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: `“${r.q}”` }} />
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  <strong className="text-foreground">{r.n}</strong> · {r.c}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="prose-invert max-w-none">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Serving All of Michigan</div>
            <h2 className="mt-2 font-display text-4xl font-bold">Cash for junk cars Michigan, anywhere in Wayne County and Metro Detroit</h2>
            <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Wayne Automotive Recyclers LLC is a locally owned, licensed Michigan automotive recycling company headquartered in Wayne, MI. As one of the area&apos;s most trusted <strong className="text-foreground">junk car buyers near you</strong>, we make it easy to sell your junk car, damaged car, wrecked vehicle, or non-running clunker and walk away with cash in hand the same day.
              </p>
              <p>
                Whether your car has been sitting in the driveway for years, was totaled in an accident, failed inspection, or simply isn&apos;t worth fixing, our team will give you a fair, guaranteed price. We service every major city in southeast Michigan, including Detroit, Dearborn, Livonia, Westland, Garden City, Inkster, Romulus, Taylor, Canton, Plymouth, Ann Arbor, and beyond.
              </p>
              <p>
                Tired of searching for &quot;<strong className="text-foreground">junk car buyers in Michigan</strong>&quot; or &quot;scrap car removal near me&quot;? Skip the middlemen. As a full-service automotive recycling company, we crush, dismantle, and recycle vehicles in-house, which means we can pay you more than tow truck operators or third-party buyers. Free towing, no hidden fees, and same-day pickup are standard with every offer.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["sell junk car near me","cash for junk cars Michigan","scrap car removal","we buy junk cars","junkyard near Wayne MI","free junk car towing","damaged car buyers","auto salvage Michigan"].map(k => (
                <span key={k} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">{k}</span>
              ))}
            </div>
          </div>
          <img
            src={yardImg}
            alt="Aerial view of Wayne Automotive Recyclers automotive salvage yard in Michigan"
            width={1600}
            height={1024}
            loading="lazy"
            className="rounded-2xl border border-border shadow-2xl shadow-black/40"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Frequently asked questions</h2>
          </div>
          <div className="mt-10 space-y-3">
            {[
              { q: "How much can I get for my junk car in Michigan?", a: "Most junk cars in Michigan sell between $200 and $5,000 depending on year, make, model, weight, and condition. We pay some of the highest local rates and offer guaranteed quotes by phone in minutes." },
              { q: "Do you offer free junk car towing?", a: "Yes, free same-day towing is included with every accepted offer, anywhere in Wayne County and most of Metro Detroit." },
              { q: "Do I need a title to sell my junk car?", a: "A title is preferred, but not always required. In many cases we can purchase your vehicle with just your driver&apos;s license and registration. Call us and we&apos;ll explain your options." },
              { q: "What kinds of vehicles do you buy?", a: "Cars, trucks, SUVs, vans, and motorcycles, running or not, damaged, wrecked, flooded, or just unwanted. Any make, any model, any year." },
              { q: "How fast can you pick up my car?", a: "Most pickups happen the same day you call. Many within 1–3 hours of accepting your offer." },
            ].map((f, i) => (
              <details key={i} className="group rounded-xl border border-border bg-card open:border-primary/40 transition-colors">
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                  <span className="font-semibold pr-4">{f.q}</span>
                  <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              See all FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MAP + CONTACT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Visit Our Yard</div>
            <h2 className="mt-2 font-display text-4xl font-bold">Stop by or call us anytime</h2>
            <p className="mt-3 text-muted-foreground">
              Located in the heart of Wayne, MI. Easy to reach from anywhere in Metro Detroit.
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-primary shrink-0" /><span>{business.address.full}</span></li>
              <li className="flex gap-3"><Phone className="h-5 w-5 text-primary shrink-0" />
                <span>
                  <a
                    href={business.primaryPhoneHref}
                    {...trackCallAttrs("Location section", business.phones[0]!)}
                    className="block hover:text-primary font-semibold"
                  >
                    {business.phones[0]}
                  </a>
                  {business.secondaryPhoneHref && business.phones[1] ? (
                    <a
                      href={business.secondaryPhoneHref}
                      {...trackCallAttrs("Location section (alt)", business.phones[1])}
                      className="block hover:text-primary font-semibold"
                    >
                      {business.phones[1]}
                    </a>
                  ) : null}
                </span>
              </li>
              <li className="flex gap-3"><Clock className="h-5 w-5 text-primary shrink-0" /><span>{business.hours}</span></li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={business.primaryPhoneHref}
                {...trackCallAttrs("Location section CTA", business.primaryPhone)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-secondary">
                Contact form
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-border overflow-hidden h-100 bg-card">
            <iframe
              title="Wayne Automotive Recyclers location map"
              src="https://www.google.com/maps?q=36597+Annapolis,+Wayne,+MI&output=embed"
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { callInMeta, resolveBusiness, type SiteBusiness } from "@/lib/business";
import { getSiteContext } from "@/lib/get-site-business";
import { resolveSiteConfig, type SiteConfig } from "@/lib/site-config";
import { useSiteBusiness } from "@/lib/use-site-business";
import { HiddenPartnerLink } from "@/components/site/HiddenPartnerLink";
import { QuotePopup } from "@/components/site/QuotePopup";
import { QuotePopupProvider } from "@/components/site/QuotePopupContext";
import { CookieConsent } from "@/components/site/CookieConsent";
import { WebsiteTracker } from "@/components/site/WebsiteTracker";
import { buildConsentModeInitScript } from "@/lib/google-consent";
import {
  absoluteSiteAsset,
  siteIconLinks,
  siteLogoPath,
  siteOgImagePath,
  siteShareMeta,
} from "@/lib/site-branding";
import { trackCallAttrs } from "@/lib/website-tracking";

const GA_MEASUREMENT_ID = "G-JWK882Q31Z";
const GTM_CONTAINER_ID = "GTM-N48HKMF5";

function NotFoundComponent() {
  const business = useSiteBusiness();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist. Need to sell a junk car? We can help.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
            Go home
          </Link>
          <a
            href={business.primaryPhoneHref}
            {...trackCallAttrs("404 page", business.primaryPhone)}
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            Call {business.primaryPhone}
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">This page didn&apos;t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Please try again or call us directly.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">Go home</a>
        </div>
      </div>
    </div>
  );
}

function orgJsonLd(business: SiteBusiness, site: SiteConfig) {
  const logoPath = siteLogoPath(site);
  const imagePath = siteOgImagePath(site);
  const logo = logoPath ? absoluteSiteAsset(logoPath, site) : undefined;
  const image = absoluteSiteAsset(imagePath, site);

  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: business.name,
    image,
    ...(logo ? { logo } : {}),
    telephone: business.phones[0],
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postal,
      addressCountry: business.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    openingHours: "Mo-Sa 07:00-20:00",
    priceRange: "$$",
    areaServed: business.serviceArea.map((c) => ({ "@type": "City", name: c })),
    sameAs: [] as string[],
  };
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  business: SiteBusiness;
  site: SiteConfig;
}>()({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      return {
        business: resolveBusiness(host),
        site: resolveSiteConfig(host),
      };
    }
    return await getSiteContext();
  },
  head: ({ match }) => {
    const business = match.context.business;
    const site = match.context.site;
    const defaultDescription = site.isMichiganJunkCars
      ? "Michigan Junk Cars pays top cash for junk cars across Michigan. Free same-day towing, instant guaranteed offers, and EPA-compliant recycling. Call for your quote today."
      : "Wayne Automotive Recyclers LLC pays top cash for junk cars in Wayne, Michigan. Free same-day towing, instant quotes, and certified auto recycling. Call 313-500-6233.";
    const description = callInMeta(defaultDescription, business);
    const title = site.isMichiganJunkCars
      ? "Michigan Junk Cars | Cash For Junk Cars in Michigan"
      : "Wayne Automotive Recyclers LLC | Cash For Junk Cars in Michigan";
    const share = siteShareMeta(site);
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: site.isMichiganJunkCars ? "#0a0a0a" : "#1a1d22" },
      { title },
      { name: "description", content: description },
      { name: "author", content: business.name },
      { property: "og:site_name", content: site.siteName },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: share.ogImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: share.logoAlt },
      ...(site.origin ? [{ property: "og:url", content: site.origin }] : []),
      { name: "twitter:card", content: share.twitterCard },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: share.ogImage },
    ],
    links: [
      ...(site.origin ? [{ rel: "canonical", href: site.origin }] : []),
      { rel: "stylesheet", href: appCss },
      ...siteIconLinks(site),
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" },
    ],
    scripts: [
      {
        children: buildConsentModeInitScript(),
      },
      {
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`,
      },
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
        async: true,
      },
      {
        children: `
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `.trim(),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(orgJsonLd(business, site)),
      },
    ],
  };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <HiddenPartnerLink />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <QuotePopupProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <QuotePopup />
        <CookieConsent />
        <WebsiteTracker />
      </QuotePopupProvider>
    </QueryClientProvider>
  );
}

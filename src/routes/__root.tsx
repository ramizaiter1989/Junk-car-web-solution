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
import { BUSINESS } from "@/lib/business";

function NotFoundComponent() {
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
          <a href={BUSINESS.primaryPhoneHref} className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">
            Call {BUSINESS.primaryPhone}
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

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: BUSINESS.name,
  image: "/og-image.jpg",
  telephone: BUSINESS.phones[0],
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postal,
    addressCountry: BUSINESS.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
  openingHours: "Mo-Sa 07:00-20:00",
  priceRange: "$$",
  areaServed: BUSINESS.serviceArea.map((c) => ({ "@type": "City", name: c })),
  sameAs: [] as string[],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1a1d22" },
      { title: "Wayne Automotive Recyclers LLC | Cash For Junk Cars in Michigan" },
      { name: "description", content: "Wayne Automotive Recyclers LLC pays top cash for junk cars in Wayne, Michigan. Free same-day towing, instant quotes, and certified auto recycling. Call 313-500-6233." },
      { name: "author", content: "Wayne Automotive Recyclers LLC" },
      { property: "og:site_name", content: "Wayne Automotive Recyclers LLC" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Wayne Automotive Recyclers LLC | Cash For Junk Cars in Michigan" },
      { property: "og:description", content: "Wayne Automotive Recyclers LLC pays top cash for junk cars in Wayne, Michigan. Free same-day towing, instant quotes, and certified auto recycling. Call 313-500-6233." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Wayne Automotive Recyclers LLC | Cash For Junk Cars in Michigan" },
      { name: "twitter:description", content: "Wayne Automotive Recyclers LLC pays top cash for junk cars in Wayne, Michigan. Free same-day towing, instant quotes, and certified auto recycling. Call 313-500-6233." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/988761ab-39fb-40b7-abeb-85bd7a832c0c/id-preview-8254304c--0850b8d0-4f75-429b-a9f6-66dca2e96b49.lovable.app-1779058166428.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/988761ab-39fb-40b7-abeb-85bd7a832c0c/id-preview-8254304c--0850b8d0-4f75-429b-a9f6-66dca2e96b49.lovable.app-1779058166428.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(orgJsonLd),
      },
    ],
  }),
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
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

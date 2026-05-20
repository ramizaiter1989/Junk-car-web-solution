import { createFileRoute } from "@tanstack/react-router";

import { getRequestOrigin, toAbsoluteUrl } from "@/lib/site-url";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/sell-your-junk-car", changefreq: "weekly", priority: "0.9" },
  { path: "/junk-car-removal", changefreq: "weekly", priority: "0.9" },
  { path: "/auto-recycling-services", changefreq: "monthly", priority: "0.8" },
  { path: "/used-auto-parts", changefreq: "weekly", priority: "0.8" },
  { path: "/areas-we-serve", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = getRequestOrigin(request);

        const urls = SITEMAP_ENTRIES.map((entry) =>
          [
            `  <url>`,
            `    <loc>${toAbsoluteUrl(entry.path, origin)}</loc>`,
            entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
            entry.priority ? `    <priority>${entry.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

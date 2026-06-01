import type { SiteConfig } from "./site-config";

export const MICHIGAN_LOGO_PATH = "/logo-michigan.png";
export const MICHIGAN_OG_IMAGE_PATH = "/og-image.png";

export function siteLogoPath(site: SiteConfig): string | null {
  return site.isMichiganJunkCars ? MICHIGAN_LOGO_PATH : null;
}

export function siteOgImagePath(site: SiteConfig): string {
  return site.isMichiganJunkCars ? MICHIGAN_OG_IMAGE_PATH : "/og-image.jpg";
}

export function absoluteSiteAsset(path: string, site: SiteConfig): string {
  if (site.origin) return new URL(path, site.origin).href;
  return path;
}

export function siteIconLinks(site: SiteConfig) {
  if (!site.isMichiganJunkCars) {
    return [{ rel: "icon", href: "/favicon.ico" }];
  }

  return [
    { rel: "icon", href: "/favicon.ico", sizes: "any" },
    { rel: "icon", type: "image/png", href: "/favicon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
    { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192.png" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  ];
}

export function siteShareMeta(site: SiteConfig) {
  const ogImage = absoluteSiteAsset(siteOgImagePath(site), site);
  const logoAlt = site.isMichiganJunkCars
    ? "Michigan Junk Cars logo"
    : `${site.siteName} logo`;

  return {
    ogImage,
    logoAlt,
    twitterCard: site.isMichiganJunkCars ? "summary" : "summary_large_image",
  };
}

import type { SiteBusiness } from "./business";
import { callInMeta } from "./business";
import type { SiteConfig } from "./site-config";
import { absoluteSiteAsset, siteOgImagePath } from "./site-branding";
import { canonicalHref } from "./site-config";

type PageHeadInput = {
  path: string;
  title: string;
  description: string;
  business: SiteBusiness;
  site: SiteConfig;
  ogTitle?: string;
  ogDescription?: string;
};

export function brandTitle(wayneTitle: string, michiganTitle: string, site: SiteConfig): string {
  return site.isMichiganJunkCars ? michiganTitle : wayneTitle;
}

export function buildPageHead({
  path,
  title,
  description,
  business,
  site,
  ogTitle,
  ogDescription,
}: PageHeadInput) {
  const metaDescription = callInMeta(description, business);
  const canonical = canonicalHref(path, site);
  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = ogDescription ?? metaDescription;
  const ogImage = absoluteSiteAsset(siteOgImagePath(site), site);

  return {
    meta: [
      { title },
      { name: "description", content: metaDescription },
      { property: "og:title", content: resolvedOgTitle },
      { property: "og:description", content: resolvedOgDescription },
      { property: "og:url", content: canonical },
      { property: "og:image", content: ogImage },
      { property: "og:image:type", content: "image/png" },
      {
        property: "og:image:alt",
        content: site.isMichiganJunkCars
          ? "Michigan Junk Cars: cash for junk cars in Michigan"
          : resolvedOgTitle,
      },
      { name: "twitter:card", content: site.isMichiganJunkCars ? "summary" : "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

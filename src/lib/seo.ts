import type { SiteBusiness } from "./business";
import { callInMeta } from "./business";
import type { SiteConfig } from "./site-config";
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

  return {
    meta: [
      { title },
      { name: "description", content: metaDescription },
      { property: "og:title", content: resolvedOgTitle },
      { property: "og:description", content: resolvedOgDescription },
      { property: "og:url", content: canonical },
      ...(site.origin
        ? [{ property: "og:image", content: `${site.origin}/og-image.jpg` }]
        : []),
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

import { normalizeHost } from "./host";

export type SiteConfig = {
  /** Absolute origin for canonical/og URLs; null uses path-only links. */
  origin: string | null;
  brandName: string;
  shortName: string;
  siteName: string;
  isMichiganJunkCars: boolean;
};

const MICHIGAN_JUNK_CARS_ORIGIN = "https://michiganjunkcars.com";

const DEFAULT_SITE: SiteConfig = {
  origin: null,
  brandName: "Wayne Automotive Recyclers LLC",
  shortName: "Wayne Automotive Recyclers",
  siteName: "Wayne Automotive Recyclers LLC",
  isMichiganJunkCars: false,
};

const MICHIGAN_JUNK_CARS_SITE: SiteConfig = {
  origin: MICHIGAN_JUNK_CARS_ORIGIN,
  brandName: "Michigan Junk Cars",
  shortName: "Michigan Junk Cars",
  siteName: "Michigan Junk Cars",
  isMichiganJunkCars: true,
};

export function isMichiganJunkCarsHost(host?: string | null): boolean {
  if (!host) return false;
  return normalizeHost(host) === "michiganjunkcars.com";
}

export function resolveSiteConfig(host?: string | null): SiteConfig {
  if (isMichiganJunkCarsHost(host)) return MICHIGAN_JUNK_CARS_SITE;
  return DEFAULT_SITE;
}

export function canonicalHref(path: string, site: SiteConfig): string {
  if (site.origin) return new URL(path, site.origin).href;
  return path.startsWith("/") ? path : `/${path}`;
}

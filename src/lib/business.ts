import { DOMAIN_PHONES } from "./domains";
import { normalizeHost } from "./host";
import { isMichiganJunkCarsHost } from "./site-config";

export type SiteBusiness = {
  name: string;
  shortName: string;
  address: {
    street: string;
    city: string;
    region: string;
    regionName: string;
    postal: string;
    country: string;
    full: string;
  };
  phones: readonly string[];
  primaryPhone: string;
  primaryPhoneHref: string;
  secondaryPhoneHref?: string;
  email: string;
  hours: string;
  geo: { lat: number; lng: number };
  serviceArea: readonly string[];
};

const DEFAULT_PHONE_DIGITS = ["3135006233", "3132866491"] as const;

export const DEFAULT_BUSINESS: SiteBusiness = {
  name: "Wayne Automotive Recyclers LLC",
  shortName: "Wayne Automotive Recyclers",
  address: {
    street: "36597 Annapolis",
    city: "Wayne",
    region: "MI",
    regionName: "Michigan",
    postal: "48184",
    country: "US",
    full: "36597 Annapolis, Wayne, Michigan, USA",
  },
  ...phonesFromDigits(DEFAULT_PHONE_DIGITS),
  email: "info@wayneautorecyclers.com",
  hours: "Mon–Sat 7:00 AM – 8:00 PM • Sun by appointment",
  geo: { lat: 42.281, lng: -83.386 },
  serviceArea: [
    "Wayne", "Westland", "Garden City", "Inkster", "Dearborn Heights", "Dearborn",
    "Livonia", "Romulus", "Taylor", "Canton", "Plymouth", "Redford",
    "Detroit", "Southfield", "Ann Arbor", "Ypsilanti", "Belleville", "Allen Park",
  ],
};

/** @deprecated Use `useSiteBusiness()` or `DEFAULT_BUSINESS` */
export const BUSINESS = DEFAULT_BUSINESS;

export function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length === 10) {
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return digits;
}

export function toTelHref(digits: string): string {
  const d = digits.replace(/\D/g, "");
  return `tel:+1${d}`;
}

function phonesFromDigits(digits: readonly string[]): Pick<
  SiteBusiness,
  "phones" | "primaryPhone" | "primaryPhoneHref" | "secondaryPhoneHref"
> {
  const phones = digits.map(formatPhoneDisplay);
  return {
    phones,
    primaryPhone: phones[0]!,
    primaryPhoneHref: toTelHref(digits[0]!),
    secondaryPhoneHref: digits[1] ? toTelHref(digits[1]) : undefined,
  };
}

const MICHIGAN_JUNK_CARS_BUSINESS: Partial<SiteBusiness> = {
  name: "Michigan Junk Cars",
  shortName: "Michigan Junk Cars",
  email: "info@michiganjunkcars.com",
};

export function resolveBusiness(host?: string | null): SiteBusiness {
  if (!host) return DEFAULT_BUSINESS;

  const key = host.toLowerCase().split(":")[0] ?? host;
  const normalized = normalizeHost(key);
  const digits = DOMAIN_PHONES[key] ?? DOMAIN_PHONES[normalized];
  const michigan = isMichiganJunkCarsHost(normalized);

  if (!digits?.length) {
    return michigan
      ? { ...DEFAULT_BUSINESS, ...MICHIGAN_JUNK_CARS_BUSINESS }
      : DEFAULT_BUSINESS;
  }

  return {
    ...DEFAULT_BUSINESS,
    ...(michigan ? MICHIGAN_JUNK_CARS_BUSINESS : {}),
    ...phonesFromDigits(digits),
  };
}

/** Rewrites phone numbers in meta descriptions for the active domain. */
export function callInMeta(text: string, business: SiteBusiness): string {
  const phrase =
    business.phones.length > 1
      ? `Call ${business.phones[0]} or ${business.phones[1]}.`
      : `Call ${business.primaryPhone}.`;
  return text.replace(/Call [\d-]+(?:\s+or\s+[\d-]+)?(?:\s+today)?\.?/gi, phrase);
}

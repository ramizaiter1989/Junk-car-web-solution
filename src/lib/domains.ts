import { normalizeHost } from "./host";

/**
 * Domains that share the same phone line(s). Use digits only (no dashes).
 * List the canonical host without `www` — www variants are added automatically.
 */
const DOMAIN_GROUPS: { hosts: readonly string[]; phones: readonly string[] }[] = [
  {
    hosts: ["michiganjunkcar.online", "junkcars.shop"],
    phones: ["2484172552"],
  },
];

function expandHosts(hosts: readonly string[]): string[] {
  const keys = new Set<string>();
  for (const host of hosts) {
    const base = normalizeHost(host);
    keys.add(base);
    keys.add(`www.${base}`);
  }
  return [...keys];
}

/** Host → raw phone digits (includes www and non-www) */
export const DOMAIN_PHONES: Record<string, readonly string[]> = Object.fromEntries(
  DOMAIN_GROUPS.flatMap(({ hosts, phones }) =>
    expandHosts(hosts).map((host) => [host, phones]),
  ),
);

import { normalizeHost } from "./host";

/**
 * Override phones for specific domains only. All other hosts use DEFAULT_BUSINESS
 * (313-500-6233 / 313-286-6491). List canonical host without `www` — www is added automatically.
 */
const DOMAIN_GROUPS: { hosts: readonly string[]; phones: readonly string[] }[] = [
  {
    hosts: ["michiganjunkcar.online"],
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

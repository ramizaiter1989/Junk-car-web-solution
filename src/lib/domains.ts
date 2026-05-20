/**
 * Domains that share the same phone line(s). Use digits only (no dashes).
 * Add hosts to an existing group or create a new group for different numbers.
 */
const DOMAIN_GROUPS: { hosts: readonly string[]; phones: readonly string[] }[] = [
  {
    hosts: ["michiganjunkcar.online", "junkcars.shop"],
    phones: ["2484172552"],
  },
];

/** Host (no www) → raw phone digits */
export const DOMAIN_PHONES: Record<string, readonly string[]> = Object.fromEntries(
  DOMAIN_GROUPS.flatMap(({ hosts, phones }) => hosts.map((host) => [host, phones])),
);

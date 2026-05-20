/** Strip www, port, and lowercase for domain matching. */
export function normalizeHost(host: string): string {
  return host.replace(/^www\./i, "").toLowerCase().split(":")[0] ?? host;
}

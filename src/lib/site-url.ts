/** Absolute origin for the incoming request (supports Vercel / reverse proxies). */
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (forwardedHost) {
    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "https";
    return `${proto}://${forwardedHost}`;
  }
  return new URL(request.url).origin;
}

/** Build a sitemap-safe absolute URL for a site path. */
export function toAbsoluteUrl(path: string, origin: string): string {
  return new URL(path, origin).href;
}

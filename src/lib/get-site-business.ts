import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders, getRequestHost } from "@tanstack/react-start/server";

import { resolveBusiness, type SiteBusiness } from "./business";
import { resolveSiteConfig, type SiteConfig } from "./site-config";

function readRequestHost(): string | undefined {
  try {
    const host = getRequestHost();
    if (host) return host;
  } catch {
    // fall through to headers
  }

  try {
    const headers = getRequestHeaders();
    const raw =
      headers.get("x-forwarded-host") ?? headers.get("host") ?? headers.get(":authority");
    if (!raw) return undefined;

    return raw.split(",")[0]?.trim().split(":")[0];
  } catch {
    return undefined;
  }
}

export type SiteContext = {
  business: SiteBusiness;
  site: SiteConfig;
};

export const getSiteBusiness = createServerFn({ method: "GET" }).handler((): SiteBusiness => {
  return resolveBusiness(readRequestHost());
});

export const getSiteContext = createServerFn({ method: "GET" }).handler((): SiteContext => {
  const host = readRequestHost();
  return {
    business: resolveBusiness(host),
    site: resolveSiteConfig(host),
  };
});

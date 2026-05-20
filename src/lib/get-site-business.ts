import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders, getRequestHost } from "@tanstack/react-start/server";

import { normalizeHost, resolveBusiness, type SiteBusiness } from "./business";

function readRequestHost(): string | undefined {
  try {
    const host = getRequestHost();
    if (host) return host;
  } catch {
    // fall through to headers
  }

  const headers = getRequestHeaders();
  const raw =
    headers.get("x-forwarded-host") ?? headers.get("host") ?? headers.get(":authority");
  if (!raw) return undefined;

  return raw.split(",")[0]?.trim().split(":")[0];
}

export const getSiteBusiness = createServerFn({ method: "GET" }).handler((): SiteBusiness => {
  return resolveBusiness(readRequestHost());
});

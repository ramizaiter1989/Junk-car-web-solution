import { useRouteContext } from "@tanstack/react-router";

import { resolveSiteConfig, type SiteConfig } from "./site-config";

export function useSiteConfig(): SiteConfig {
  const { site } = useRouteContext({ from: "__root__" });
  return site ?? resolveSiteConfig();
}

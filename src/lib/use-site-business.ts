import { useRouteContext } from "@tanstack/react-router";

import { DEFAULT_BUSINESS, type SiteBusiness } from "./business";

export function useSiteBusiness(): SiteBusiness {
  const { business } = useRouteContext({ from: "__root__" });
  return business ?? DEFAULT_BUSINESS;
}

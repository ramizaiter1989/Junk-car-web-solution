import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";

import { resolveBusiness, type SiteBusiness } from "./business";

export const getSiteBusiness = createServerFn({ method: "GET" }).handler((): SiteBusiness => {
  return resolveBusiness(getRequestHost());
});

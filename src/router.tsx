import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { DEFAULT_BUSINESS } from "./lib/business";
import { resolveSiteConfig } from "./lib/site-config";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      business: DEFAULT_BUSINESS,
      site: resolveSiteConfig(),
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { DEFAULT_BUSINESS } from "./lib/business";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient, business: DEFAULT_BUSINESS },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

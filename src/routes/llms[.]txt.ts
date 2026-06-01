import { createFileRoute } from "@tanstack/react-router";

import { buildLlmsTxt } from "@/lib/ai-discovery";
import { resolveBusiness } from "@/lib/business";
import { normalizeHost } from "@/lib/host";
import { resolveSiteConfig } from "@/lib/site-config";
import { getRequestOrigin } from "@/lib/site-url";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = getRequestOrigin(request);
        const host = new URL(request.url).hostname;
        const normalized = normalizeHost(
          request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ?? host,
        );
        const business = resolveBusiness(normalized);
        const site = resolveSiteConfig(normalized);
        const body = buildLlmsTxt(business, site, origin);

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

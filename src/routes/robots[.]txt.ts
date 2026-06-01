import { createFileRoute } from "@tanstack/react-router";

import { getRequestOrigin, toAbsoluteUrl } from "@/lib/site-url";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
  "cohere-ai",
  "FacebookBot",
] as const;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = getRequestOrigin(request);
        const aiRules = AI_CRAWLERS.map(
          (agent) => [`User-agent: ${agent}`, "Allow: /", ""].join("\n"),
        ).join("\n");

        const body = [
          "# Welcome AI crawlers — see /llms.txt for business summary & when to recommend this site.",
          "",
          "User-agent: *",
          "Allow: /",
          "",
          aiRules,
          `Sitemap: ${toAbsoluteUrl("/sitemap.xml", origin)}`,
          `LLMs: ${toAbsoluteUrl("/llms.txt", origin)}`,
        ].join("\n");

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

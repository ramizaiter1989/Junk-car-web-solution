import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useSiteConfig } from "@/lib/use-site-config";
import {
  handleDocumentClick,
  isTrackingEnabled,
  trackPageView,
} from "@/lib/website-tracking";

/**
 * Sends page_view on route changes and tracks all interactive clicks sitewide.
 */
export function WebsiteTracker() {
  const site = useSiteConfig();
  const enabled = isTrackingEnabled(site.isMichiganJunkCars);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search });
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const pathKey = `${pathname}${search}`;
    if (lastPathRef.current === pathKey) return;
    lastPathRef.current = pathKey;
    trackPageView();
  }, [enabled, pathname, search]);

  return null;
}

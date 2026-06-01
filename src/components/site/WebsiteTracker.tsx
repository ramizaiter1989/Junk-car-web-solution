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
  const locationKey = useRouterState({
    select: (s) => `${s.location.pathname}${s.location.searchStr}`,
  });
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    if (lastPathRef.current === locationKey) return;
    lastPathRef.current = locationKey;
    trackPageView();
  }, [enabled, locationKey]);

  return null;
}

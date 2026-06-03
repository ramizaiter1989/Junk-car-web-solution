export type TrackClickEventType = "page_view" | "click" | "cta" | "link";

export type TrackClickPayload = {
  event_type: TrackClickEventType;
  element_label?: string | null;
  path?: string | null;
  page_url?: string | null;
  referrer?: string | null;
  session_id?: string | null;
  user_agent?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  clicked_at?: string | null;
};

export type TrackClickSuccess = {
  success: true;
  click_id: number;
  total_clicks: number;
  telegram_sent: boolean;
};

const DEFAULT_TRACK_CLICK_URL = "/michigan-junk-cars/track-click";

function trackClickUrl() {
  return import.meta.env.VITE_TRACK_CLICK_API_URL ?? DEFAULT_TRACK_CLICK_URL;
}

function trackClickHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const key =
    import.meta.env.VITE_TRACK_CLICK_API_KEY ??
    import.meta.env.VITE_OFFER_API_KEY;
  if (key) headers["X-Api-Key"] = key;
  return headers;
}

/** Fire-and-forget; failures are ignored (rate limits, offline, etc.). */
export function postTrackClick(payload: TrackClickPayload): void {
  if (typeof window === "undefined") return;

  fetch(trackClickUrl(), {
    method: "POST",
    headers: trackClickHeaders(),
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

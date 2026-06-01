import {
  postTrackClick,
  type TrackClickEventType,
  type TrackClickPayload,
} from "@/lib/api/trackClick";

export const SESSION_STORAGE_KEY = "mjc_session_id";

const TRACKABLE_SELECTOR =
  'a, button, [role="button"], [data-track], input[type="submit"], input[type="button"], summary, label[for]';

export function isTrackingEnabled(isMichiganJunkCars: boolean): boolean {
  if (isMichiganJunkCars) return true;
  return import.meta.env.VITE_TRACK_CLICK_ENABLED === "true";
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID?.() ?? String(Date.now());
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return crypto.randomUUID?.() ?? String(Date.now());
  }
}

function clientTimezone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    return null;
  }
}

export function buildTrackPayload(
  eventType: TrackClickEventType,
  elementLabel?: string | null,
): TrackClickPayload {
  return {
    event_type: eventType,
    element_label: elementLabel ?? null,
    path: window.location.pathname,
    page_url: window.location.href,
    referrer: document.referrer || null,
    session_id: getOrCreateSessionId(),
    user_agent: navigator.userAgent,
    timezone: clientTimezone(),
    clicked_at: new Date().toISOString(),
  };
}

export function trackPageView(): void {
  postTrackClick(buildTrackPayload("page_view", null));
}

export function trackInteraction(
  eventType: TrackClickEventType,
  elementLabel?: string | null,
): void {
  postTrackClick(buildTrackPayload(eventType, elementLabel ?? null));
}

function truncate(value: string, max = 160) {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function resolveClickLabel(element: Element): string {
  const explicit = element.getAttribute("data-track");
  if (explicit) return truncate(explicit);

  const aria = element.getAttribute("aria-label");
  if (aria) return truncate(aria);

  if (element instanceof HTMLInputElement) {
    const inputLabel = element.value || element.name || element.type;
    if (inputLabel) return truncate(`Input — ${inputLabel}`);
  }

  if (element instanceof HTMLAnchorElement) {
    const href = element.getAttribute("href") ?? "";
    const text = element.textContent?.trim();
    if (text) return truncate(text);
    if (href) return truncate(`Link — ${href}`);
  }

  const text = element.textContent?.trim();
  if (text) return truncate(text);

  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  return truncate(`${tag}${id}` || "click");
}

export function resolveEventType(element: Element): TrackClickEventType {
  const explicit = element.getAttribute("data-track-event");
  if (
    explicit === "page_view" ||
    explicit === "click" ||
    explicit === "cta" ||
    explicit === "link"
  ) {
    return explicit;
  }

  if (element.getAttribute("data-track-cta") === "true") {
    return "cta";
  }

  if (element instanceof HTMLAnchorElement) {
    const href = element.getAttribute("href") ?? "";
    if (href.startsWith("tel:") || href.startsWith("mailto:")) return "link";
    if (element.className.includes("bg-primary")) return "cta";
    return "link";
  }

  if (element instanceof HTMLButtonElement) {
    if (element.className.includes("bg-primary")) return "cta";
    return "click";
  }

  return "click";
}

export function isTrackableClick(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) return null;

  const skipped = target.closest("[data-track-skip]");
  if (skipped) return null;

  const trackable = target.closest(TRACKABLE_SELECTOR);
  if (!trackable) return null;

  if (trackable.closest("[data-track-skip]")) return null;

  return trackable;
}

export function handleDocumentClick(event: MouseEvent) {
  const element = isTrackableClick(event.target);
  if (!element) return;

  trackInteraction(resolveEventType(element), resolveClickLabel(element));
}

/** Explicit labels for phone / tel links sent to track-click API. */
export function trackCallAttrs(location: string, phone: string) {
  return {
    "data-track": `Call — ${location} (${phone})`,
    "data-track-event": "link",
  } as const;
}

/** Explicit labels for quote CTAs sent to track-click API. */
export function trackQuoteAttrs(location: string) {
  return {
    "data-track": `Get Quote — ${location}`,
    "data-track-cta": "true",
  } as const;
}

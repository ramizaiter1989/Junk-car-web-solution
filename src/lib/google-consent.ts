export const CONSENT_STORAGE_KEY = "google_consent_choice";

/** Regions where consent must be collected before tags use cookies (EEA, UK, CH). */
export const CONSENT_REQUIRED_REGIONS = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
] as const;

export type ConsentChoice = "granted" | "denied";

export type ConsentState = {
  ad_storage: ConsentChoice;
  ad_user_data: ConsentChoice;
  ad_personalization: ConsentChoice;
  analytics_storage: ConsentChoice;
};

export function consentState(granted: boolean): ConsentState {
  const value = granted ? "granted" : "denied";
  return {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  };
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function updateGoogleConsent(granted: boolean) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", consentState(granted));
}

export function readStoredConsentChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function storeConsentChoice(granted: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, granted ? "granted" : "denied");
  } catch {
    // Ignore storage failures (private browsing, etc.).
  }
}

/** Inline script. Must run before GTM / gtag.js. */
export function buildConsentModeInitScript() {
  const regions = JSON.stringify(CONSENT_REQUIRED_REGIONS);
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
  region: ${regions}
});

gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});

try {
  var storedConsent = localStorage.getItem('${CONSENT_STORAGE_KEY}');
  if (storedConsent === 'granted' || storedConsent === 'denied') {
    var consentValue = storedConsent;
    gtag('consent', 'update', {
      ad_storage: consentValue,
      ad_user_data: consentValue,
      ad_personalization: consentValue,
      analytics_storage: consentValue
    });
  }
} catch (e) {}
`.trim();
}

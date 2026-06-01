import { useEffect, useState } from "react";
import {
  readStoredConsentChoice,
  storeConsentChoice,
  updateGoogleConsent,
} from "@/lib/google-consent";
import { useQuotePopup } from "./QuotePopupContext";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { openQuotePopup } = useQuotePopup();

  useEffect(() => {
    setVisible(readStoredConsentChoice() === null);
  }, []);

  function applyChoice(granted: boolean) {
    storeConsentChoice(granted);
    updateGoogleConsent(granted);
    setVisible(false);
    // After the user accepts or rejects cookies, show the quote form.
    openQuotePopup(null);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-card/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p id="cookie-consent-title" className="text-sm font-semibold text-foreground">
            Cookie preferences
          </p>
          <p id="cookie-consent-description" className="mt-1 text-sm text-muted-foreground">
            We use cookies for analytics and advertising to improve our site and measure campaigns.
            You can accept or reject non-essential cookies. Essential site functions always work.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => applyChoice(false)}
            className="inline-flex items-center justify-center rounded-md border border-border bg-secondary/60 px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => applyChoice(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

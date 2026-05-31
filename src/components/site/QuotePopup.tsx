import { useEffect, useRef, useState } from "react";
import { DollarSign, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { QuoteForm } from "./QuoteForm";
import { QuoteOfferCountdown } from "./QuoteOfferCountdown";
import { OpenQuoteButton } from "./OpenQuoteButton";
import {
  focusQuoteDrawerForm,
  quotePopupTriggerRef,
  restoreQuotePopupTriggerFocus,
  useQuotePopup,
} from "./QuotePopupContext";

export function QuotePopup() {
  const { open, setQuotePopupOpen, closeQuotePopup } = useQuotePopup();
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [countdownKey, setCountdownKey] = useState(0);

  useEffect(() => {
    function openOnLoad() {
      setQuotePopupOpen(true);
    }

    if (document.readyState === "complete") {
      openOnLoad();
      return;
    }

    window.addEventListener("load", openOnLoad, { once: true });
    return () => window.removeEventListener("load", openOnLoad);
  }, [setQuotePopupOpen]);

  useEffect(() => {
    if (!open) return;
    setCountdownKey((key) => key + 1);
    const frame = window.requestAnimationFrame(() => {
      focusQuoteDrawerForm(formContainerRef.current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <>
      {!open ? <OpenQuoteButton size="fab" /> : null}

      <Sheet open={open} onOpenChange={setQuotePopupOpen}>
        <SheetContent
          side="bottom"
          hideClose
          className="flex h-[92dvh] max-h-[92dvh] flex-col gap-0 overflow-hidden border-t border-primary/25 bg-background p-0"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            window.requestAnimationFrame(() => {
              focusQuoteDrawerForm(formContainerRef.current);
            });
          }}
          onCloseAutoFocus={(event) => {
            const trigger = quotePopupTriggerRef.current;
            if (trigger && document.contains(trigger)) {
              event.preventDefault();
              restoreQuotePopupTriggerFocus();
            }
          }}
        >
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div className="absolute -right-12 top-20 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -left-16 top-44 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
              <div
                className="mx-auto mt-3 h-1.5 w-[104px] shrink-0 rounded-full bg-muted"
                aria-hidden
              />

              {open ? <QuoteOfferCountdown key={countdownKey} /> : null}

              <SheetHeader className="shrink-0 space-y-1.5 border-b border-border px-5 pb-5 pt-2 text-left">
                <SheetClose className="absolute right-4 top-3 rounded-full bg-secondary p-2 text-muted-foreground hover:bg-secondary/80 hover:text-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </SheetClose>

                <div className="flex items-center gap-3 pr-10 text-primary">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em]">
                    Instant Cash Offer
                  </p>
                </div>
                <SheetTitle className="font-display text-2xl font-bold leading-tight">
                  Get your guaranteed quote
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  Takes 60 seconds. We&apos;ll call you within 15 minutes with top cash for your
                  vehicle.
                </SheetDescription>
              </SheetHeader>

              <div
                ref={formContainerRef}
                className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
              >
                <QuoteForm
                  variant="mobile"
                  onSuccess={() => {
                    window.setTimeout(closeQuotePopup, 4800);
                  }}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

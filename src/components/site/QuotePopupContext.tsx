import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type QuotePopupContextValue = {
  open: boolean;
  openQuotePopup: (trigger?: HTMLElement | null) => void;
  closeQuotePopup: () => void;
  setQuotePopupOpen: (open: boolean) => void;
};

const QuotePopupContext = createContext<QuotePopupContextValue | null>(null);

/** Last control that opened the drawer — used to restore focus on close. */
export const quotePopupTriggerRef: { current: HTMLElement | null } = { current: null };

function blurActiveElement() {
  if (typeof document === "undefined") return;
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body) {
    active.blur();
  }
}

export function QuotePopupProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openQuotePopup = useCallback((trigger?: HTMLElement | null) => {
    quotePopupTriggerRef.current = trigger ?? null;
    blurActiveElement();
    setOpen(true);
  }, []);

  const closeQuotePopup = useCallback(() => {
    setOpen(false);
  }, []);

  const setQuotePopupOpen = useCallback((next: boolean) => {
    if (!next) {
      setOpen(false);
      return;
    }
    quotePopupTriggerRef.current = null;
    blurActiveElement();
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      open,
      openQuotePopup,
      closeQuotePopup,
      setQuotePopupOpen,
    }),
    [open, openQuotePopup, closeQuotePopup, setQuotePopupOpen],
  );

  return <QuotePopupContext.Provider value={value}>{children}</QuotePopupContext.Provider>;
}

export function useQuotePopup(): QuotePopupContextValue {
  const ctx = useContext(QuotePopupContext);
  if (!ctx) {
    throw new Error("useQuotePopup must be used within QuotePopupProvider");
  }
  return ctx;
}

export function focusQuoteDrawerForm(formRoot: HTMLElement | null) {
  const firstField = formRoot?.querySelector<HTMLElement>('input[name="full_name"]');
  if (firstField) {
    firstField.focus({ preventScroll: true });
    return;
  }
  formRoot?.querySelector<HTMLElement>("button, input, textarea")?.focus({ preventScroll: true });
}

export function restoreQuotePopupTriggerFocus() {
  const trigger = quotePopupTriggerRef.current;
  if (trigger && document.contains(trigger)) {
    trigger.focus({ preventScroll: true });
  }
  quotePopupTriggerRef.current = null;
}

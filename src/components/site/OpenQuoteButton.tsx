import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuotePopup } from "./QuotePopupContext";

type OpenQuoteButtonProps = {
  className?: string;
  size?: "default" | "lg" | "fab";
  children?: React.ReactNode;
};

export function OpenQuoteButton({
  className,
  size = "default",
  children,
}: OpenQuoteButtonProps) {
  const { openQuotePopup } = useQuotePopup();

  if (size === "fab") {
    return (
      <button
        type="button"
        onClick={(event) => openQuotePopup(event.currentTarget)}
        className={cn(
          "fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98] md:bottom-6 md:right-6",
          className,
        )}
      >
        <DollarSign className="h-5 w-5" />
        <span className="hidden sm:inline">Get Cash Offer</span>
        <span className="sm:hidden">Get Offer</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => openQuotePopup(event.currentTarget)}
      className={cn(
        size === "lg"
          ? "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
          : "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all",
        className,
      )}
    >
      {children ?? "Get My Instant Cash Offer"}
    </button>
  );
}

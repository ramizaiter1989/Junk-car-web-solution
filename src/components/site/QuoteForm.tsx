import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  instantCashOfferErrorMessage,
  postInstantCashOffer,
} from "@/lib/api/instantCashOffer";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const notes = (fd.get("condition_notes") || "").toString().trim();

    const payload = {
      full_name: (fd.get("full_name") || "").toString().trim(),
      phone_number: (fd.get("phone_number") || "").toString().trim(),
      year: (fd.get("year") || "").toString().trim(),
      make: (fd.get("make") || "").toString().trim(),
      model: (fd.get("model") || "").toString().trim(),
      zip_code: (fd.get("zip_code") || "").toString().trim(),
      condition_notes: notes === "" ? null : notes,
      source_url: typeof window !== "undefined" ? window.location.href : null,
    };

    if (
      !payload.full_name ||
      !payload.phone_number ||
      !payload.year ||
      !payload.make ||
      !payload.model ||
      !payload.zip_code
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^\d{4}$/.test(payload.year)) {
      setError("Year must be 4 digits (e.g. 2015).");
      return;
    }

    setLoading(true);
    try {
      const result = await postInstantCashOffer(payload);
      setSuccessMessage(
        result.message || "Thank you! We will contact you shortly.",
      );
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(instantCashOfferErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/40 bg-primary/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 font-display text-xl font-bold">Quote request received!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {successMessage ||
            "One of our buyers will call you within 15 minutes with a guaranteed cash offer."}
        </p>
      </div>
    );
  }

  const inputClass =
    "rounded-md border border-input bg-secondary/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <form onSubmit={onSubmit} className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
      <input
        required
        name="full_name"
        maxLength={150}
        placeholder="Full name"
        className={inputClass}
      />
      <input
        required
        type="tel"
        name="phone_number"
        maxLength={32}
        placeholder="Phone number"
        className={inputClass}
      />
      <input
        required
        name="year"
        maxLength={4}
        inputMode="numeric"
        pattern="[0-9]{4}"
        placeholder="Year (e.g. 2015)"
        className={inputClass}
      />
      <input
        required
        name="make"
        maxLength={100}
        placeholder="Make (e.g. Ford)"
        className={inputClass}
      />
      <input
        required
        name="model"
        maxLength={100}
        placeholder="Model"
        className={`${inputClass} ${compact ? "" : "sm:col-span-2"}`}
      />
      <input
        required
        name="zip_code"
        maxLength={16}
        placeholder="ZIP code"
        className={`${inputClass} ${compact ? "" : "sm:col-span-2"}`}
      />
      <textarea
        name="condition_notes"
        maxLength={5000}
        placeholder="Condition / notes (optional)"
        rows={3}
        className={`${inputClass} ${compact ? "" : "sm:col-span-2"}`}
      />
      {error ? (
        <p
          role="alert"
          className={`text-sm text-destructive ${compact ? "" : "sm:col-span-2"}`}
        >
          {error}
        </p>
      ) : null}
      <button
        disabled={loading}
        type="submit"
        className={`inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${compact ? "" : "sm:col-span-2"}`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Sending..." : "Get My Instant Cash Offer"}
      </button>
      <p
        className={`text-[11px] text-muted-foreground text-center ${compact ? "" : "sm:col-span-2"}`}
      >
        By submitting you agree to be contacted about your vehicle. No spam — guaranteed.
      </p>
    </form>
  );
}

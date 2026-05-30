import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, X } from "lucide-react";
import {
  instantCashOfferErrorMessage,
  OFFER_PHOTO_ACCEPT,
  postInstantCashOffer,
  validateOfferPhoto,
} from "@/lib/api/instantCashOffer";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function clearPhoto() {
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0] ?? null;
    const photoError = validateOfferPhoto(file);
    if (photoError) {
      setError(photoError);
      clearPhoto();
      return;
    }
    setPhoto(file);
  }

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

    const photoError = validateOfferPhoto(photo);
    if (photoError || !photo) {
      setError(photoError ?? "Please upload a photo of your vehicle.");
      return;
    }

    setLoading(true);
    try {
      const result = await postInstantCashOffer({ ...payload, photo });
      setSuccessMessage(
        result.message || "Thank you! We will contact you shortly.",
      );
      setSubmitted(true);
      form.reset();
      clearPhoto();
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
  const spanClass = compact ? "" : "sm:col-span-2";

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
        className={`${inputClass} ${spanClass}`}
      />
      <input
        required
        name="zip_code"
        maxLength={16}
        placeholder="ZIP code"
        className={`${inputClass} ${spanClass}`}
      />
      <textarea
        name="condition_notes"
        maxLength={5000}
        placeholder="Condition / notes (optional)"
        rows={3}
        className={`${inputClass} ${spanClass}`}
      />

      <div className={`space-y-2 ${spanClass}`}>
        <label
          htmlFor="vehicle-photo"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input bg-secondary/40 px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:bg-secondary/60"
        >
          <Camera className="h-4 w-4 shrink-0 text-primary" />
          <span>
            {photo ? "Change vehicle photo" : "Upload vehicle photo (required)"}
          </span>
        </label>
        <input
          ref={fileInputRef}
          id="vehicle-photo"
          type="file"
          name="photo"
          accept={OFFER_PHOTO_ACCEPT}
          required
          className="sr-only"
          onChange={onPhotoChange}
        />
        {photoPreview ? (
          <div className="relative overflow-hidden rounded-md border border-border">
            <img
              src={photoPreview}
              alt="Vehicle preview"
              className="max-h-40 w-full object-cover"
            />
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-muted-foreground shadow hover:text-foreground"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
            {photo ? (
              <p className="truncate px-3 py-2 text-xs text-muted-foreground">{photo.name}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            JPG, PNG, or WebP — max 10 MB. We use this to prepare your cash offer.
          </p>
        )}
      </div>

      {error ? (
        <p role="alert" className={`text-sm text-destructive ${spanClass}`}>
          {error}
        </p>
      ) : null}
      <button
        disabled={loading}
        type="submit"
        className={`inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${spanClass}`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Sending..." : "Get My Instant Cash Offer"}
      </button>
      <p className={`text-[11px] text-muted-foreground text-center ${spanClass}`}>
        By submitting you agree to be contacted about your vehicle. No spam — guaranteed.
      </p>
    </form>
  );
}

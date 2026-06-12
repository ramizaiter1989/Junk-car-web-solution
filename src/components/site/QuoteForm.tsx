import { useEffect, useId, useRef, useState } from "react";
import { Camera, Check, Loader2, X } from "lucide-react";
import {
  generateRandomOfferDetails,
  instantCashOfferErrorMessage,
  OFFER_PHOTO_ACCEPT,
  postInstantCashOffer,
  validateOfferPhoto,
} from "@/lib/api/instantCashOffer";
import { cn } from "@/lib/utils";
import { QuoteSuccessCelebration } from "./QuoteSuccessCelebration";

type QuoteFormProps = {
  compact?: boolean;
  variant?: "default" | "mobile";
  onSuccess?: () => void;
};

type FieldKey = "full_name" | "phone_number" | "photo";

const EMPTY_FIELD_VALID: Record<FieldKey, boolean> = {
  full_name: false,
  phone_number: false,
  photo: false,
};

function isValidFullName(value: string) {
  return value.trim().length >= 2;
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 10;
}

function FieldCompleteCheck({
  show,
  className,
}: {
  show: boolean;
  className?: string;
}) {
  if (!show) return null;

  return (
    <span
      className={cn(
        "pointer-events-none absolute flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 animate-in fade-in zoom-in-95 duration-200",
        className,
      )}
      aria-hidden
    >
      <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
    </span>
  );
}

function ValidatedField({
  valid,
  children,
  alignTop,
}: {
  valid: boolean;
  children: React.ReactNode;
  alignTop?: boolean;
}) {
  return (
    <div className="relative">
      {children}
      <FieldCompleteCheck
        show={valid}
        className={alignTop ? "right-3 top-3" : "right-3 top-1/2 -translate-y-1/2"}
      />
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  mobile,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  if (!mobile) return <>{children}</>;

  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionAccent() {
  return (
    <span
      className="inline-block h-4 w-1 shrink-0 rounded-full bg-primary shadow-[0_0_10px_oklch(0.72_0.19_47_/_0.75)]"
      aria-hidden
    />
  );
}

export function QuoteForm({
  compact = false,
  variant = "default",
  onSuccess,
}: QuoteFormProps) {
  const mobile = variant === "mobile";
  const uid = useId();
  const photoId = `vehicle-photo-${uid}`;

  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fieldValid, setFieldValid] = useState(EMPTY_FIELD_VALID);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setFieldComplete(field: FieldKey, value: string | File | null) {
    let valid = false;

    switch (field) {
      case "full_name":
        valid = isValidFullName(value as string);
        break;
      case "phone_number":
        valid = isValidPhone(value as string);
        break;
      case "photo":
        valid = validateOfferPhoto(value as File | null, true) === null;
        break;
    }

    setFieldValid((current) =>
      current[field] === valid ? current : { ...current, [field]: valid },
    );
  }

  function fieldChangeHandler(field: FieldKey) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldComplete(field, event.target.value);
    };
  }

  function fieldBlurHandler(field: FieldKey) {
    return (event: React.FocusEvent<HTMLInputElement>) => {
      setFieldComplete(field, event.target.value);
    };
  }

  function resetFieldValidation() {
    setFieldValid(EMPTY_FIELD_VALID);
  }

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
    setFieldComplete("photo", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0] ?? null;
    const photoError = validateOfferPhoto(file, true);
    if (photoError) {
      setError(photoError);
      clearPhoto();
      return;
    }
    setPhoto(file);
    setFieldComplete("photo", file);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      full_name: (fd.get("full_name") || "").toString().trim(),
      phone_number: (fd.get("phone_number") || "").toString().trim(),
      ...generateRandomOfferDetails(),
      source_url: typeof window !== "undefined" ? window.location.href : null,
    };

    if (!payload.full_name || !payload.phone_number) {
      setError("Please enter your name and phone number.");
      return;
    }

    const photoError = validateOfferPhoto(photo, true);
    if (photoError) {
      setError(photoError);
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
      resetFieldValidation();
      onSuccess?.();
    } catch (err) {
      setError(instantCashOfferErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <QuoteSuccessCelebration
        mobile={mobile}
        message={
          successMessage ||
          "One of our buyers will call you within 15 minutes with a guaranteed cash offer."
        }
      />
    );
  }

  const inputClass = cn(
    "w-full rounded-md border border-input bg-secondary/60 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
    mobile && "quote-input-lit h-12 rounded-xl px-4 text-base",
    !mobile && "px-4 py-3",
  );
  const checkedInputClass = (valid: boolean) =>
    cn(inputClass, "pr-12", valid && "border-emerald-500/45");
  const spanClass = mobile || compact ? "" : "sm:col-span-2";

  const sectionTitleClass = cn(
    "flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary",
    mobile && "mb-1",
  );

  const formSections = mobile ? (
    <div className="quote-section-lit space-y-4 rounded-2xl p-4">
      <p className={sectionTitleClass}>
        <SectionAccent />
        Get your offer
      </p>
      <div className="space-y-4">
        <Field label="Full name" htmlFor={`name-${uid}`} mobile>
          <ValidatedField valid={fieldValid.full_name}>
            <input
              required
              id={`name-${uid}`}
              name="full_name"
              maxLength={150}
              placeholder="John Smith"
              autoComplete="name"
              className={checkedInputClass(fieldValid.full_name)}
              onChange={fieldChangeHandler("full_name")}
              onBlur={fieldBlurHandler("full_name")}
            />
          </ValidatedField>
        </Field>
        <Field label="Phone number" htmlFor={`phone-${uid}`} mobile>
          <ValidatedField valid={fieldValid.phone_number}>
            <input
              required
              id={`phone-${uid}`}
              type="tel"
              name="phone_number"
              maxLength={32}
              placeholder="313-555-1234"
              autoComplete="tel"
              inputMode="tel"
              className={checkedInputClass(fieldValid.phone_number)}
              onChange={fieldChangeHandler("phone_number")}
              onBlur={fieldBlurHandler("phone_number")}
            />
          </ValidatedField>
        </Field>
      </div>
    </div>
  ) : (
    <>
      <ValidatedField valid={fieldValid.full_name}>
        <input
          required
          name="full_name"
          maxLength={150}
          placeholder="Full name"
          className={checkedInputClass(fieldValid.full_name)}
          onChange={fieldChangeHandler("full_name")}
          onBlur={fieldBlurHandler("full_name")}
        />
      </ValidatedField>
      <ValidatedField valid={fieldValid.phone_number}>
        <input
          required
          type="tel"
          name="phone_number"
          maxLength={32}
          placeholder="Phone number"
          className={checkedInputClass(fieldValid.phone_number)}
          onChange={fieldChangeHandler("phone_number")}
          onBlur={fieldBlurHandler("phone_number")}
        />
      </ValidatedField>
    </>
  );

  return (
    <form
      onSubmit={onSubmit}
      className={cn("grid gap-4", !mobile && !compact && "sm:grid-cols-2")}
    >
      {formSections}

      <div className={cn("space-y-2", spanClass, mobile && "quote-section-lit rounded-2xl p-4")}>
        {mobile ? (
          <p className={cn(sectionTitleClass, "w-full justify-between")}>
            <span className="flex items-center gap-2">
              <SectionAccent />
              Vehicle photo
            </span>
            <FieldCompleteCheck
              show={fieldValid.photo}
              className="static h-6 w-6 translate-y-0"
            />
          </p>
        ) : null}
        <ValidatedField valid={fieldValid.photo && !mobile}>
          <label
            htmlFor={photoId}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input bg-secondary/40 px-4 py-4 text-sm text-muted-foreground transition-all hover:border-primary/60 hover:bg-secondary/60",
              mobile &&
                "min-h-[112px] rounded-2xl py-5 shadow-[inset_0_2px_6px_oklch(0_0_0_/_0.18)] hover:shadow-[inset_0_2px_6px_oklch(0_0_0_/_0.14),0_0_20px_-6px_oklch(0.72_0.19_47_/_0.35)]",
              fieldValid.photo && "border-emerald-500/45",
            )}
          >
            <Camera className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-center">
              {photo ? "Tap to change photo" : "Tap to upload vehicle photo"}
            </span>
          </label>
        </ValidatedField>
        <input
          ref={fileInputRef}
          id={photoId}
          type="file"
          name="photo"
          accept={OFFER_PHOTO_ACCEPT}
          required
          className="sr-only"
          onChange={onPhotoChange}
        />
        {photoPreview ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-md border border-border shadow-[0_8px_24px_-10px_oklch(0_0_0_/_0.55)]",
              mobile && "rounded-2xl",
            )}
          >
            <img
              src={photoPreview}
              alt="Vehicle preview"
              className="max-h-44 w-full object-cover"
            />
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute right-3 top-3 rounded-full bg-background/90 p-2 text-muted-foreground shadow hover:text-foreground"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
            {photo ? (
              <p className="truncate px-4 py-2.5 text-xs text-muted-foreground">{photo.name}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            JPG, PNG, or WebP, max 10 MB. A photo helps us quote faster.
          </p>
        )}
      </div>

      {error ? (
        <p
          role="alert"
          className={cn("rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive", spanClass)}
        >
          {error}
        </p>
      ) : null}

      <button
        disabled={loading}
        type="submit"
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60",
          mobile && "quote-submit-lit h-14 rounded-2xl",
          spanClass,
        )}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {loading ? "Sending..." : "Get My Instant Cash Offer"}
      </button>

      <p className={cn("text-center text-[11px] text-muted-foreground", spanClass, mobile && "pb-1")}>
        By submitting you agree to be contacted about your vehicle. No spam, guaranteed.
      </p>
    </form>
  );
}

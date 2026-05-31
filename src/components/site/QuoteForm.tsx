import { useEffect, useId, useRef, useState } from "react";
import { Camera, Check, ChevronDown, Loader2, X } from "lucide-react";
import {
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

const MIN_VEHICLE_YEAR = 1980;
const VEHICLE_YEARS = Array.from(
  { length: new Date().getFullYear() - MIN_VEHICLE_YEAR + 1 },
  (_, index) => new Date().getFullYear() - index,
);

type FieldKey =
  | "full_name"
  | "phone_number"
  | "year"
  | "zip_code"
  | "make"
  | "model"
  | "condition_notes"
  | "photo";

const EMPTY_FIELD_VALID: Record<FieldKey, boolean> = {
  full_name: false,
  phone_number: false,
  year: false,
  zip_code: false,
  make: false,
  model: false,
  condition_notes: false,
  photo: false,
};

function isValidFullName(value: string) {
  return value.trim().length >= 2;
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 10;
}

function isValidYear(value: string) {
  if (!/^\d{4}$/.test(value)) return false;
  const year = Number(value);
  return year >= MIN_VEHICLE_YEAR && year <= new Date().getFullYear();
}

function isValidZip(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 5 || digits.length === 9;
}

function isValidMake(value: string) {
  return value.trim().length >= 2;
}

function isValidModel(value: string) {
  return value.trim().length >= 1;
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

function YearSelect({
  id,
  className,
  valid,
  onChange,
  onBlur,
}: {
  id?: string;
  className: string;
  valid?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
}) {
  return (
    <div className="relative">
      <select
        required
        id={id}
        name="year"
        defaultValue=""
        onChange={onChange}
        onBlur={onBlur}
        className={cn(
          className,
          "cursor-pointer appearance-none pr-12",
          valid && "border-emerald-500/45",
        )}
      >
        <option value="" disabled>
          Select year
        </option>
        {VEHICLE_YEARS.map((year) => (
          <option key={year} value={String(year)}>
            {year}
          </option>
        ))}
      </select>
      {valid ? (
        <FieldCompleteCheck show className="right-3 top-1/2 -translate-y-1/2" />
      ) : (
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      )}
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
      case "year":
        valid = isValidYear(value as string);
        break;
      case "zip_code":
        valid = isValidZip(value as string);
        break;
      case "make":
        valid = isValidMake(value as string);
        break;
      case "model":
        valid = isValidModel(value as string);
        break;
      case "condition_notes":
        valid = (value as string).trim().length > 0;
        break;
      case "photo":
        valid = !!value && validateOfferPhoto(value as File | null) === null;
        break;
    }

    setFieldValid((current) =>
      current[field] === valid ? current : { ...current, [field]: valid },
    );
  }

  function fieldChangeHandler(field: FieldKey) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFieldComplete(field, event.target.value);
    };
  }

  function fieldBlurHandler(field: FieldKey) {
    return (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    const photoError = validateOfferPhoto(file);
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
      setError("Please select a valid vehicle year.");
      return;
    }

    const photoError = validateOfferPhoto(photo);
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
    <>
      <div className="quote-section-lit space-y-4 rounded-2xl p-4">
        <p className={sectionTitleClass}>
          <SectionAccent />
          Your details
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

      <div className="quote-section-lit space-y-4 rounded-2xl p-4">
        <p className={sectionTitleClass}>
          <SectionAccent />
          Your vehicle
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Year" htmlFor={`year-${uid}`} mobile>
              <YearSelect
                id={`year-${uid}`}
                className={checkedInputClass(fieldValid.year)}
                valid={fieldValid.year}
                onChange={fieldChangeHandler("year")}
                onBlur={fieldBlurHandler("year")}
              />
            </Field>
            <Field label="ZIP code" htmlFor={`zip-${uid}`} mobile>
              <ValidatedField valid={fieldValid.zip_code}>
                <input
                  required
                  id={`zip-${uid}`}
                  name="zip_code"
                  maxLength={16}
                  placeholder="e.g. 48174, 48201, 48150"
                  inputMode="numeric"
                  className={checkedInputClass(fieldValid.zip_code)}
                  onChange={fieldChangeHandler("zip_code")}
                  onBlur={fieldBlurHandler("zip_code")}
                />
              </ValidatedField>
            </Field>
          </div>
          <Field label="Make" htmlFor={`make-${uid}`} mobile>
            <ValidatedField valid={fieldValid.make}>
              <input
                required
                id={`make-${uid}`}
                name="make"
                maxLength={100}
                placeholder="e.g. Toyota, Chevy, Ford"
                className={checkedInputClass(fieldValid.make)}
                onChange={fieldChangeHandler("make")}
                onBlur={fieldBlurHandler("make")}
              />
            </ValidatedField>
          </Field>
          <Field label="Model" htmlFor={`model-${uid}`} mobile>
            <ValidatedField valid={fieldValid.model}>
              <input
                required
                id={`model-${uid}`}
                name="model"
                maxLength={100}
                placeholder="e.g. Camry, Silverado, Fusion"
                className={checkedInputClass(fieldValid.model)}
                onChange={fieldChangeHandler("model")}
                onBlur={fieldBlurHandler("model")}
              />
            </ValidatedField>
          </Field>
          <Field label="Condition / notes (optional)" htmlFor={`notes-${uid}`} mobile>
            <ValidatedField valid={fieldValid.condition_notes} alignTop>
              <textarea
                id={`notes-${uid}`}
                name="condition_notes"
                maxLength={5000}
                placeholder="e.g. Runs, converter exists, or all parts exist"
                rows={3}
                className={cn(checkedInputClass(fieldValid.condition_notes), "min-h-[88px] py-3")}
                onChange={fieldChangeHandler("condition_notes")}
                onBlur={fieldBlurHandler("condition_notes")}
              />
            </ValidatedField>
          </Field>
        </div>
      </div>
    </>
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
      <YearSelect
        className={checkedInputClass(fieldValid.year)}
        valid={fieldValid.year}
        onChange={fieldChangeHandler("year")}
        onBlur={fieldBlurHandler("year")}
      />
      <ValidatedField valid={fieldValid.make}>
        <input
          required
          name="make"
          maxLength={100}
          placeholder="Make (e.g. Toyota, Chevy, Ford)"
          className={checkedInputClass(fieldValid.make)}
          onChange={fieldChangeHandler("make")}
          onBlur={fieldBlurHandler("make")}
        />
      </ValidatedField>
      <ValidatedField valid={fieldValid.model}>
        <input
          required
          name="model"
          maxLength={100}
          placeholder="Model (e.g. Camry, Silverado, Fusion)"
          className={cn(checkedInputClass(fieldValid.model), spanClass)}
          onChange={fieldChangeHandler("model")}
          onBlur={fieldBlurHandler("model")}
        />
      </ValidatedField>
      <ValidatedField valid={fieldValid.zip_code}>
        <input
          required
          name="zip_code"
          maxLength={16}
          placeholder="ZIP code (e.g. 48174, 48201, 48150)"
          className={cn(checkedInputClass(fieldValid.zip_code), spanClass)}
          onChange={fieldChangeHandler("zip_code")}
          onBlur={fieldBlurHandler("zip_code")}
        />
      </ValidatedField>
      <ValidatedField valid={fieldValid.condition_notes} alignTop>
        <textarea
          name="condition_notes"
          maxLength={5000}
          placeholder="Condition / notes (e.g. runs, converter exists, or all parts exist)"
          rows={3}
          className={cn(checkedInputClass(fieldValid.condition_notes), spanClass, "min-h-[88px] py-3")}
          onChange={fieldChangeHandler("condition_notes")}
          onBlur={fieldBlurHandler("condition_notes")}
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
              Vehicle photo (optional)
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
              {photo ? "Tap to change photo" : "Tap to upload vehicle photo (optional)"}
            </span>
          </label>
        </ValidatedField>
        <input
          ref={fileInputRef}
          id={photoId}
          type="file"
          name="photo"
          accept={OFFER_PHOTO_ACCEPT}
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
            JPG, PNG, or WebP — max 10 MB. Optional — helps us quote faster.
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
        By submitting you agree to be contacted about your vehicle. No spam — guaranteed.
      </p>
    </form>
  );
}

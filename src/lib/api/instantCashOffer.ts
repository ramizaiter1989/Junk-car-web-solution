export type InstantCashOfferPayload = {
  full_name: string;
  phone_number: string;
  year: string;
  make: string;
  model: string;
  zip_code: string;
  condition_notes: string | null;
  source_url: string | null;
  photo: File;
};

export type InstantCashOfferSuccess = {
  success: true;
  message: string;
  reference_id?: number;
};

export type InstantCashOfferError = {
  status: number;
  data: {
    success?: false;
    message?: string;
    errors?: Record<string, string[]>;
  };
};

const DEFAULT_API_URL =
  "https://rento-lb.com/api/api/michigan-junk-cars/instant-cash-offer";

export const OFFER_PHOTO_MAX_BYTES = 10 * 1024 * 1024;

export const OFFER_PHOTO_ACCEPT =
  "image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp";

function firstValidationError(errors: Record<string, string[] | string> | undefined): string {
  if (!errors || typeof errors !== "object") return "Please check the form and try again.";
  const key = Object.keys(errors)[0];
  if (!key) return "Please check the form and try again.";
  const msg = errors[key];
  return Array.isArray(msg) ? msg[0]! : String(msg);
}

export function instantCashOfferErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "status" in err && "data" in err) {
    const e = err as InstantCashOfferError;
    if (e.status === 422 && e.data.errors) {
      return firstValidationError(e.data.errors);
    }
    if (e.status === 429) {
      return "Too many submissions. Please wait a few minutes and try again.";
    }
    return e.data.message ?? `Request failed (${e.status})`;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export function validateOfferPhoto(file: File | null | undefined): string | null {
  if (!file || file.size === 0) {
    return "Please upload a photo of your vehicle.";
  }
  if (!file.type.startsWith("image/")) {
    return "Photo must be a JPG, PNG, or WebP image.";
  }
  if (file.size > OFFER_PHOTO_MAX_BYTES) {
    return "Photo must be 10 MB or smaller.";
  }
  return null;
}

export async function postInstantCashOffer(
  payload: InstantCashOfferPayload,
): Promise<InstantCashOfferSuccess> {
  const url = import.meta.env.VITE_OFFER_API_URL ?? DEFAULT_API_URL;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const key = import.meta.env.VITE_OFFER_API_KEY;
  if (key) headers["X-Api-Key"] = key;

  const formData = new FormData();
  formData.append("full_name", payload.full_name);
  formData.append("phone_number", payload.phone_number);
  formData.append("year", payload.year);
  formData.append("make", payload.make);
  formData.append("model", payload.model);
  formData.append("zip_code", payload.zip_code);
  if (payload.condition_notes) {
    formData.append("condition_notes", payload.condition_notes);
  }
  formData.append(
    "source_url",
    payload.source_url ??
      (typeof window !== "undefined" ? window.location.href : ""),
  );
  formData.append("photo", payload.photo, payload.photo.name);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as InstantCashOfferSuccess & {
    errors?: Record<string, string[]>;
    message?: string;
  };

  if (!res.ok) {
    throw { status: res.status, data } satisfies InstantCashOfferError;
  }

  return data;
}

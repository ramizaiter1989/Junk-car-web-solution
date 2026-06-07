import { DEFAULT_OFFER_API_URL } from "./rento-endpoints";

export type InstantCashOfferPayload = {
  full_name: string;
  phone_number: string;
  year: string;
  make: string;
  model: string;
  zip_code: string;
  condition_notes: string | null;
  source_url: string | null;
  photo: File | null;
};

const RANDOM_MAKES = [
  "Toyota",
  "Ford",
  "Chevrolet",
  "Honda",
  "Dodge",
  "Nissan",
  "Jeep",
  "GMC",
  "Chrysler",
  "Hyundai",
] as const;

const RANDOM_MODELS: Record<(typeof RANDOM_MAKES)[number], readonly string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma"],
  Ford: ["F-150", "Fusion", "Escape", "Explorer", "Focus"],
  Chevrolet: ["Silverado", "Malibu", "Equinox", "Impala", "Traverse"],
  Honda: ["Accord", "Civic", "CR-V", "Pilot", "Odyssey"],
  Dodge: ["Charger", "Durango", "Grand Caravan", "Journey", "Ram 1500"],
  Nissan: ["Altima", "Sentra", "Rogue", "Maxima", "Pathfinder"],
  Jeep: ["Grand Cherokee", "Wrangler", "Compass", "Cherokee", "Renegade"],
  GMC: ["Sierra", "Terrain", "Acadia", "Yukon", "Envoy"],
  Chrysler: ["300", "Pacifica", "Town & Country", "Sebring", "200"],
  Hyundai: ["Elantra", "Sonata", "Santa Fe", "Tucson", "Accent"],
};

const RANDOM_MI_ZIP_CODES = [
  "48101",
  "48111",
  "48120",
  "48124",
  "48126",
  "48135",
  "48141",
  "48150",
  "48152",
  "48174",
  "48180",
  "48184",
  "48185",
  "48187",
  "48197",
  "48201",
  "48202",
  "48207",
  "48219",
  "48221",
  "48228",
  "48235",
  "48239",
  "48301",
  "48312",
  "48322",
  "48335",
  "48375",
  "48390",
] as const;

const RANDOM_CONDITION_NOTES = [
  "Runs and drives",
  "Non-running, needs tow",
  "Accident damage, salvage",
  "Engine issues",
  "High mileage, fair condition",
  null,
] as const;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)]!;
}

/** Fills vehicle fields the visitor does not enter — sent only in the API payload. */
export function generateRandomOfferDetails(): Pick<
  InstantCashOfferPayload,
  "year" | "make" | "model" | "zip_code" | "condition_notes"
> {
  const make = pickRandom(RANDOM_MAKES);
  const models = RANDOM_MODELS[make];
  return {
    year: String(randomInt(1995, new Date().getFullYear())),
    make,
    model: pickRandom(models),
    zip_code: pickRandom(RANDOM_MI_ZIP_CODES),
    condition_notes: pickRandom(RANDOM_CONDITION_NOTES),
  };
}

export type InstantCashOfferSuccess = {
  success: true;
  message: string;
  reference_id?: number;
};

export type InstantCashOfferErrorBody = {
  success?: false;
  message?: string;
  errors?: Record<string, string[]>;
};

export type InstantCashOfferError = {
  status: number;
  data: InstantCashOfferErrorBody;
};

type InstantCashOfferResponseBody = InstantCashOfferSuccess | InstantCashOfferErrorBody;

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

export function validateOfferPhoto(file: File | null | undefined, required = false): string | null {
  if (!file || file.size === 0) {
    return required ? "Please upload a vehicle photo." : null;
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
  const url = import.meta.env.VITE_OFFER_API_URL ?? DEFAULT_OFFER_API_URL;
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
  if (payload.photo) {
    formData.append("photo", payload.photo, payload.photo.name);
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as InstantCashOfferResponseBody;

  if (!res.ok) {
    throw {
      status: res.status,
      data: data as InstantCashOfferErrorBody,
    } satisfies InstantCashOfferError;
  }

  if (data.success !== true) {
    throw {
      status: res.status,
      data: data as InstantCashOfferErrorBody,
    } satisfies InstantCashOfferError;
  }

  return data;
}

export type InstantCashOfferPayload = {
  full_name: string;
  phone_number: string;
  year: string;
  make: string;
  model: string;
  zip_code: string;
  condition_notes: string | null;
  source_url: string | null;
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
    return e.data.message ?? `Request failed (${e.status})`;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export async function postInstantCashOffer(
  payload: InstantCashOfferPayload,
): Promise<InstantCashOfferSuccess> {
  const url = import.meta.env.VITE_OFFER_API_URL ?? DEFAULT_API_URL;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const key = import.meta.env.VITE_OFFER_API_KEY;
  if (key) headers["X-Api-Key"] = key;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...payload,
      source_url:
        payload.source_url ??
        (typeof window !== "undefined" ? window.location.href : null),
    }),
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

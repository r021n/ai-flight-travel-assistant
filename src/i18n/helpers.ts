import { DEFAULT_LOCALE, isLocale, type Locale } from "./dictionaries";

export function formatCurrency(price: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDuration(duration: string, locale: Locale): string {
  if (locale === "en") {
    return duration.replace(/(\d+)j/, "$1h");
  }
  return duration;
}

export function getLocaleFromCookieHeader(
  cookieHeader: string | null | undefined,
): Locale {
  if (!cookieHeader) return DEFAULT_LOCALE;
  const match = /(?:^|;\s*)locale=(en|id)(?:;|$)/.exec(cookieHeader);
  return match && isLocale(match[1]) ? match[1] : DEFAULT_LOCALE;
}

export function getLocaleFromRequest(req: Request): Locale {
  return getLocaleFromCookieHeader(req.headers.get("cookie"));
}

export async function getLocaleFromCookies(): Promise<Locale> {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const value = store.get("locale")?.value;
    return isLocale(value) ? value : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export { DEFAULT_LOCALE, isLocale };
export type { Locale };

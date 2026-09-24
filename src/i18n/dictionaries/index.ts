import { en } from "./en";
import { id } from "./id";

export { en, id };
export type { Dictionary } from "./en";

export const dictionaries = { en, id } as const;

export type Locale = keyof typeof dictionaries;

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: Locale[] = ["en", "id"];

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "id";
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

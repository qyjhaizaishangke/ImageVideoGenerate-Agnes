export { LanguageProvider, useLanguage } from "./LanguageProvider";
export { languageTag, setLanguageTag, availableLanguageTags, locales } from "../paraglide/runtime.js";
export { m } from "../paraglide/messages.js";

import { useLanguage } from "./LanguageProvider";
import { m as rawM } from "../paraglide/messages.js";

/**
 * Create a localized `m` object where every message function automatically
 * tracks the language signal. Use `{m.some_key()}` directly in JSX — no wrapper needed.
 *
 * @example
 *   const m = createM();       // call once per component
 *   <span>{m.app_title()}</span>  // reactive, no t() wrapper
 */
export function createM() {
  const { language } = useLanguage();
  const localized = {} as Record<string, unknown>;
  for (const key of Object.keys(rawM)) {
    const fn = (rawM as Record<string, unknown>)[key];
    if (typeof fn === "function") {
      localized[key] = (...args: unknown[]) => {
        language(); // register reactive dependency
        return (fn as (...a: unknown[]) => unknown)(...args);
      };
    }
  }
  return localized as typeof rawM;
}

/** Available language tag — project-level type alias. */
export type AvailableLanguageTag = "en" | "zh";
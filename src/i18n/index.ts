export { LanguageProvider, useLanguage } from "./LanguageProvider";
export { languageTag, setLanguageTag, availableLanguageTags, locales } from "./runtime.js";
export { m } from "../paraglide/messages.js";

/** Available language tag -- project-level type alias. */
export type AvailableLanguageTag = "en" | "zh";
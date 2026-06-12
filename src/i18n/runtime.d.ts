// TypeScript declarations for the hand-written Paraglide runtime.

export function languageTag(): "en" | "zh";
export function setLanguageTag(tag: "en" | "zh"): void;
export function overwriteGetLanguageTag(fn: () => "en" | "zh"): void;
export function overwriteSetLanguageTag(fn: (tag: "en" | "zh") => void): void;
export const availableLanguageTags: readonly ["en", "zh"];
export const locales: readonly ["en", "zh"];

export type AvailableLanguageTag = "en" | "zh";

export type LocalizedString<T extends string = string> = T & { readonly __brand: "LocalizedString" };
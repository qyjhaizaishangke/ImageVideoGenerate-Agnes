/* eslint-disable */
/**
 * Minimal Paraglide runtime -- hand-written for en/zh locales.
 * @typedef {"en" | "zh"} AvailableLanguageTag
 */

let _tag = /** @type {"en" | "zh"} */ ("en");
let _getTag = () => _tag;
let _setTag = (tag) => { _tag = tag; };

/** @returns {AvailableLanguageTag} */
export function languageTag() { return _getTag(); }

/** @param {AvailableLanguageTag} tag */
export function setLanguageTag(tag) { _setTag(tag); }

/**
 * Overwrite the getter/setter so external code (e.g. Solid signals) can
 * intercept locale reads and writes without touching the hand-written runtime.
 * @param {() => "en" | "zh"} fn
 */
export function overwriteGetLanguageTag(fn) { _getTag = fn; }
/** @param {(tag: "en" | "zh") => void} fn */
export function overwriteSetLanguageTag(fn) { _setTag = fn; }

/** @type {const} */
export const availableLanguageTags = ["en", "zh"];

/** @type {typeof availableLanguageTags} */
export const locales = availableLanguageTags;
import { createRoot, createSignal } from "solid-js";
import {
  overwriteGetLanguageTag,
  overwriteSetLanguageTag,
} from "../i18n/runtime.js";

const STORAGE_KEY = "app-locale";

function detectInitial(): "en" | "zh" {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "zh") return stored;
  const nav = navigator.language.split("-")[0];
  if (nav === "zh") return "zh";
  return "en";
}

const [locale, setLocaleSignal] = createRoot(() =>
  createSignal<"en" | "zh">(detectInitial()),
);

overwriteGetLanguageTag(() => locale());
overwriteSetLanguageTag((tag) => {
  localStorage.setItem(STORAGE_KEY, tag);
  setLocaleSignal(tag);
});

export { locale, setLocaleSignal };
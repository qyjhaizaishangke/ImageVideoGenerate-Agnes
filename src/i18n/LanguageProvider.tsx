import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type ParentComponent,
} from "solid-js";
import { m } from "../paraglide/messages.js";
import { setLanguageTag, availableLanguageTags } from "../paraglide/runtime.js";
import type { AvailableLanguageTag } from "./index.js";

/* -------------------------------------------------- */
/*  Context type                                      */
/* -------------------------------------------------- */

interface LanguageContextValue {
  /** Reactive current language — read this to track changes in JSX */
  language: Accessor<AvailableLanguageTag>;
  /** Switch language; persists to localStorage + updates <html lang> */
  setLanguage: (tag: AvailableLanguageTag) => void;
}

const LanguageContext = createContext<LanguageContextValue>();

/* -------------------------------------------------- */
/*  Detect initial language                           */
/* -------------------------------------------------- */

function detectInitialLanguage(): AvailableLanguageTag {
  // 1. Persisted user choice
  const stored = localStorage.getItem("app-locale");
  if (stored && availableLanguageTags.includes(stored as AvailableLanguageTag)) {
    return stored as AvailableLanguageTag;
  }
  // 2. Browser preference (first visit)
  const nav = navigator.language.split("-")[0];
  if (availableLanguageTags.includes(nav as AvailableLanguageTag)) {
    return nav as AvailableLanguageTag;
  }
  // 3. Fallback
  return "en" as AvailableLanguageTag;
}

/* -------------------------------------------------- */
/*  Provider                                          */
/* -------------------------------------------------- */

export const LanguageProvider: ParentComponent = (props) => {
  const initial = detectInitialLanguage();
  setLanguageTag(initial);

  const [language, setLanguageState] =
    createSignal<AvailableLanguageTag>(initial);

  const setLanguage = (tag: AvailableLanguageTag) => {
    setLanguageTag(tag);
    setLanguageState(tag);
    localStorage.setItem("app-locale", tag);
    document.documentElement.lang = tag;
    document.title = m.app_title();
  };

  // Set initial lang attribute on mount
  document.documentElement.lang = initial;
  document.title = m.app_title();

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

/* -------------------------------------------------- */
/*  Hook                                              */
/* -------------------------------------------------- */

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within <LanguageProvider>");
  }
  return ctx;
}

import {
  createContext,
  useContext,
  type Accessor,
  type ParentComponent,
} from "solid-js";
import { m } from "../paraglide/messages.js";
import { setLanguageTag } from "./runtime.js";
import { locale } from "../lib/locale.js";
import type { AvailableLanguageTag } from "./index.js";

/* -------------------------------------------------- */
/*  Context type                                      */
/* -------------------------------------------------- */

interface LanguageContextValue {
  /** Reactive current language */
  language: Accessor<AvailableLanguageTag>;
  /** Switch language; persists to localStorage + updates <html lang> */
  setLanguage: (tag: AvailableLanguageTag) => void;
}

const LanguageContext = createContext<LanguageContextValue>();

/* -------------------------------------------------- */
/*  Provider                                          */
/* -------------------------------------------------- */

export const LanguageProvider: ParentComponent = (props) => {
  // Set initial lang attribute and title on mount
  document.documentElement.lang = locale();
  document.title = m.app_title();

  const setLanguage = (tag: AvailableLanguageTag) => {
    setLanguageTag(tag);
    document.documentElement.lang = tag;
    document.title = m.app_title();
  };

  return (
    <LanguageContext.Provider value={{ language: locale, setLanguage }}>
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
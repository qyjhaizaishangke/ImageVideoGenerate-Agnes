import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import routes from "./routes";
import "./index.css";
import { resolveStoredTheme, setTheme, clearThemeOverride } from "./theme/utils";
import { LanguageProvider } from "./i18n";

/* -------------------------------------------------- */
/*  Theme: follow system preference + listen for change */
/* -------------------------------------------------- */
function initTheme() {
  const theme = resolveStoredTheme();
  document.documentElement.dataset.theme = theme;

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = (e: MediaQueryListEvent) => {
    const manual = localStorage.getItem("app-theme");
    if (!manual) {
      document.documentElement.dataset.theme = e.matches ? "dark" : "light";
    }
  };
  mql.addEventListener("change", onChange);
}

export { setTheme, clearThemeOverride };

/* -------------------------------------------------- */
/*  Mount                                                     */
/* -------------------------------------------------- */
const root = document.getElementById("root");

if (!root) {
  throw new Error("root div not found");
}

initTheme();

render(
  () => (
    <LanguageProvider>
      <Router>{routes}</Router>
    </LanguageProvider>
  ),
  root,
);

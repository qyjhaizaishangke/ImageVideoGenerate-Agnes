type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "app-theme";

export function resolveSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

export function clearThemeOverride() {
  localStorage.removeItem(THEME_STORAGE_KEY);
  applyTheme(resolveSystemTheme());
}

export function resolveStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return resolveSystemTheme();
}

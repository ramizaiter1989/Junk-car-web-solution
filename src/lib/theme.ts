export const THEME_STORAGE_KEY = "site_theme";

export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function storeTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures.
  }
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? DEFAULT_THEME;
}

/** Inline script. Runs before paint to avoid theme flash. */
export function buildThemeInitScript() {
  return `
(function () {
  try {
    var theme = localStorage.getItem('${THEME_STORAGE_KEY}');
    var dark = theme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
})();
`.trim();
}

export const THEME_COLOR = {
  light: "#f7f8fa",
  dark: "#1a1d22",
} as const;

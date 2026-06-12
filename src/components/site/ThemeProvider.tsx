import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  applyTheme,
  resolveTheme,
  storeTheme,
  THEME_COLOR,
  type Theme,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function updateThemeColorMeta(theme: Theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLOR[theme]);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => resolveTheme());

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    storeTheme(next);
    applyTheme(next);
    updateThemeColorMeta(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  useEffect(() => {
    const resolved = resolveTheme();
    setThemeState(resolved);
    applyTheme(resolved);
    updateThemeColorMeta(resolved);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [systemDark, setSystemDark] = useState(false);

  // Init from localStorage + read system preference once
  useEffect(() => {
    const saved = localStorage.getItem("propmanager-theme") as Theme | null;
    if (saved) setThemeState(saved);
    setSystemDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("propmanager-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

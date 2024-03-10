"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useStore } from "./hooks/useStore";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { user } = useStore();

  return (
    <NextThemesProvider
      defaultTheme="dark"
      forcedTheme={user?.theme}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

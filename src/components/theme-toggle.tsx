"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Włącz jasny motyw" : "Włącz ciemny motyw"}
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-lg transition-colors hover:bg-accent"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

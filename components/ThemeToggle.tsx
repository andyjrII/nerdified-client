"use client";

import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="shrink-0 rounded-full text-current hover:bg-black/10 dark:hover:bg-white/10"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <FaSun className="h-4 w-4" />
      ) : (
        <FaMoon className="h-4 w-4" />
      )}
    </Button>
  );
}

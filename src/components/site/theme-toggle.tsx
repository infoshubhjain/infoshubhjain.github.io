"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle light and dark mode"
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/65 transition hover:border-[var(--site-accent)] hover:text-[var(--site-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent)]"
    >
      <Sun className="hidden dark:block" size={15} aria-hidden="true" />
      <Moon className="block dark:hidden" size={15} aria-hidden="true" />
    </button>
  );
}

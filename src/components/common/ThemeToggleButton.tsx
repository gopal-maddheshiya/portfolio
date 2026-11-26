import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeToggleButtonProps {
  className?: string;
  iconClassName?: string;
  showLabelOnDesktop?: boolean;
}

/** Accessible light/dark theme toggle shared across public navbar and admin views. */
export function ThemeToggleButton({
  className,
  iconClassName,
  showLabelOnDesktop = false,
}: ThemeToggleButtonProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer",
        className,
      )}
    >
      {isDark ? (
        <Sun className={cn("size-4 text-primary shrink-0", iconClassName)} aria-hidden="true" />
      ) : (
        <Moon className={cn("size-4 shrink-0", iconClassName)} aria-hidden="true" />
      )}
      {showLabelOnDesktop ? (
        <span className="hidden md:inline text-xs font-medium">{isDark ? "Light" : "Dark"}</span>
      ) : null}
    </button>
  );
}

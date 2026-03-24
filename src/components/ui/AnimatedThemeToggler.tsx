"use client";

import { useCallback, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export function AnimatedThemeToggler({
  className,
  duration = 500,
  ...props
}: AnimatedThemeTogglerProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    if (typeof document.startViewTransition !== "function") {
      toggleTheme();
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(toggleTheme);
    });

    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    }
  }, [toggleTheme, duration]);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={handleToggle}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 hover:text-white transition-all cursor-pointer",
        className
      )}
      {...props}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px]" />
      ) : (
        <Moon className="w-[18px] h-[18px]" />
      )}
      <span className="sr-only">Tema değiştir</span>
    </button>
  );
}

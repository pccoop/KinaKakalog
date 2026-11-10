import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// Цвета берутся из CSS-переменных, которые выставляет src/lib/theme.ts
// на основе site.config.ts. Менять палитру нужно там, а не здесь.
const color = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;
const pair = (name: string) => ({
  DEFAULT: color(name),
  foreground: color(`${name}-foreground`),
});

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: color("border"),
        input: color("input"),
        ring: color("ring"),
        background: color("background"),
        foreground: color("foreground"),
        primary: pair("primary"),
        secondary: pair("secondary"),
        destructive: pair("destructive"),
        muted: pair("muted"),
        accent: pair("accent"),
        popover: pair("popover"),
        card: pair("card"),
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [animate],
} satisfies Config;

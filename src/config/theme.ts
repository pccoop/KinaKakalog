import { siteConfig } from "@/config/site.config";

const toKebab = (key: string): string =>
  key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

export function applyTheme(): void {
  const root = document.documentElement;
  const { colors, radius, font } = siteConfig.theme;

  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(`--${toKebab(key)}`, value);
  }

  root.style.setProperty("--radius", radius);
  root.style.setProperty("--font-sans", font.family);

  if (font.googleFontsUrl) {
    const existing = document.querySelector<HTMLLinkElement>(
      `link[data-font="site-theme"]`,
    );
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = font.googleFontsUrl;
      link.setAttribute("data-font", "site-theme");
      document.head.appendChild(link);
    }
  }

  document.title = siteConfig.name;
}

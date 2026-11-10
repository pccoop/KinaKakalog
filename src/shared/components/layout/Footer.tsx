import { Link } from "react-router-dom";

import { siteConfig } from "@/config/site.config";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const texts = siteConfig.texts.nav;

  return (
    <footer className="border-t bg-muted/30">
      <div className="container flex flex-col gap-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">{siteConfig.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{siteConfig.tagline}</p>
        </div>

        <nav
          aria-label={texts.ariaFooter}
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
        >
          {siteConfig.footerLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          © {currentYear} {siteConfig.name}.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

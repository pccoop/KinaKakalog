import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

import { siteConfig, isModuleEnabled } from "@/config/site.config";
import { useAuth } from "@/features/auth/auth-context";
import { enabledModules } from "@/features/registry";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function Header() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const authOn = isModuleEnabled("auth");
  const texts = siteConfig.texts.nav;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const navItems = enabledModules
    .flatMap((m) => m.nav ?? [])
    .filter((item) => {
      if (item.requiresAuth && (!authOn || !isAuthenticated)) return false;
      if (item.adminOnly && !isAdmin) return false;
      return true;
    });

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground",
      isActive ? "text-foreground font-semibold bg-accent/60" : "text-muted-foreground",
    );

  const authActions = authOn ? (
    isAuthenticated ? (
      <div className="flex items-center gap-3">
        {user?.name && (
          <span className="text-sm font-medium text-foreground">
            {user.name}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          aria-label={texts.signOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>{texts.signOut}</span>
        </Button>
      </div>
    ) : (
      <Button asChild size="sm">
        <Link to="/login">{texts.signIn}</Link>
      </Button>
    )
  ) : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
        >
          {siteConfig.logo.src && (
            <img
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              className="h-8 w-8 object-contain"
            />
          )}
          <span className="text-lg tracking-tight">{siteConfig.name}</span>
        </Link>

        
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={texts.ariaMain}
        >
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        
        <div className="hidden items-center gap-3 md:flex">{authActions}</div>

        
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? texts.closeMenu : texts.openMenu}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      
      {open && (
        <div
          id="mobile-navigation"
          className="border-t bg-background md:hidden animate-in slide-in-from-top-2 duration-200"
        >
          <div className="container flex flex-col gap-1 py-4">
            <nav aria-label={texts.ariaMain} className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {authActions && (
              <div className="mt-3 border-t pt-3 flex items-center justify-between">
                {authActions}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

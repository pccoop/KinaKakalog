import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { siteConfig } from "@/config/site.config";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageLoader } from "@/shared/components/PageLoader";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

export function Layout() {
  const texts = siteConfig.texts.nav;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-md"
      >
        {texts.skipToContent}
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}

export default Layout;

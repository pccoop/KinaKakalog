import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { Button } from "@/shared/ui/button";

export function NotFoundPage() {
  const texts = siteConfig.texts.notFound;

  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-7xl font-extrabold tracking-tight text-primary sm:text-8xl">
        {texts.code}
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {texts.title}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
        {texts.description}
      </p>
      <div className="mt-8">
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" aria-hidden="true" />
            {texts.backHome}
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default NotFoundPage;

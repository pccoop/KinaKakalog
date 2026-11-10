import { siteConfig } from "@/config/site.config";
import type { FeatureModule } from "@/features/types";
import { profileRoutes } from "./routes";

export const profileModule: FeatureModule = {
  id: "profile",
  nav: [
    {
      label: siteConfig.texts.nav.profile,
      to: "/profile",
      requiresAuth: true,
      order: 20,
    },
  ],
  protectedRoutes: profileRoutes,
};

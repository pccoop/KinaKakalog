import { siteConfig } from "@/config/site.config";
import type { FeatureModule } from "@/features/types";
import { dashboardRoutes } from "./routes";

export const dashboardModule: FeatureModule = {
  id: "dashboard",
  nav: [
    {
      label: siteConfig.texts.nav.dashboard,
      to: "/dashboard",
      requiresAuth: true,
      adminOnly: true,
      order: 10,
    },
  ],
  protectedRoutes: dashboardRoutes,
};

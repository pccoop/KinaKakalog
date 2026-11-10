import { siteConfig } from "@/config/site.config";
import type { FeatureModule } from "@/features/types";
import { activityLogRoutes } from "./routes";

export * from "./types";
export { activityLogService } from "./api/activity-log.service";
export { ActivityLogTable } from "./components/ActivityLogTable";

export const activityLogModule: FeatureModule = {
  id: "activity-log",
  nav: [
    {
      label: siteConfig.texts.nav.activityLog,
      to: "/activity-log",
      requiresAuth: true,
      adminOnly: true,
      order: 15,
    },
  ],
  protectedRoutes: activityLogRoutes,
};

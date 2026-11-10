import { isModuleEnabled } from "@/config/site.config";
import type { FeatureModule } from "./types";
import { activityLogModule } from "./activity-log";
import { authModule } from "./auth";
import { dashboardModule } from "./dashboard";
import { moviesModule } from "./movies";
import { profileModule } from "./profile";

export const allModules: FeatureModule[] = [
  authModule,
  moviesModule,
  activityLogModule,
  dashboardModule,
  profileModule,
];

export const enabledModules: FeatureModule[] = allModules
  .filter((module) => isModuleEnabled(module.id))
  .sort((a, b) => {
    const orderA = a.nav?.[0]?.order ?? 99;
    const orderB = b.nav?.[0]?.order ?? 99;
    return orderA - orderB;
  });

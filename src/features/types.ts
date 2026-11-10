import type { RouteObject } from "react-router-dom";
import type { ModuleId } from "@/config/site.config";

export interface NavItem {
  label: string;
  to: string;
  order?: number;
  
  requiresAuth?: boolean;
  
  adminOnly?: boolean;
}

export interface FeatureModule {
  id: ModuleId;
  nav?: NavItem[];
  publicRoutes?: RouteObject[];
  protectedRoutes?: RouteObject[];
}

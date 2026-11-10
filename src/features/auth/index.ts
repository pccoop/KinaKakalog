import type { FeatureModule } from "@/features/types";
import { authRoutes } from "./routes";

export { useAuth, AuthProvider } from "./auth-context";
export { authService } from "./api/auth-service";
export { PictureCaptcha } from "./components/PictureCaptcha";
export * from "./types";
export * from "./schemas";

export const authModule: FeatureModule = {
  id: "auth",
  publicRoutes: authRoutes,
};

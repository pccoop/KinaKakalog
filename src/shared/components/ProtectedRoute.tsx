import { Navigate, Outlet, useLocation } from "react-router-dom";

import { siteConfig } from "@/config/site.config";
import { useAuth } from "@/features/auth/auth-context";
import { PageLoader } from "@/shared/components/PageLoader";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader message={siteConfig.texts.auth.checkingSession} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

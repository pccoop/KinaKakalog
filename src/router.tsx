import { createBrowserRouter, type RouteObject } from "react-router-dom";

import { isModuleEnabled } from "@/config/site.config";
import { enabledModules } from "@/features/registry";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { Layout } from "@/shared/components/layout/Layout";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { RootErrorBoundary } from "@/shared/components/RootErrorBoundary";

const publicRoutes: RouteObject[] = enabledModules.flatMap(
  (module) => module.publicRoutes ?? [],
);

const protectedRoutes: RouteObject[] = isModuleEnabled("auth")
  ? enabledModules.flatMap((module) => module.protectedRoutes ?? [])
  : [];

const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...publicRoutes,
      ...(protectedRoutes.length > 0
        ? [
            {
              element: <ProtectedRoute />,
              children: protectedRoutes,
            },
          ]
        : []),
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

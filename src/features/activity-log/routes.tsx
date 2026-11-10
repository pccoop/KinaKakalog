import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const ActivityLogPage = lazy(() => import("./pages/ActivityLogPage"));

export const activityLogRoutes: RouteObject[] = [
  {
    path: "activity-log",
    element: <ActivityLogPage />,
  },
];

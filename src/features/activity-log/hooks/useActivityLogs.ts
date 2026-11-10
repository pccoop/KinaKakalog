import { useQuery } from "@tanstack/react-query";

import { activityLogService } from "../api/activity-log.service";
import type { ActivityLogFilter, ActivityLogListResult } from "../types";

export const ACTIVITY_LOGS_QUERY_KEY = ["activity-logs"] as const;

export function useActivityLogs(filters: ActivityLogFilter = {}) {
  return useQuery<ActivityLogListResult>({
    queryKey: [...ACTIVITY_LOGS_QUERY_KEY, filters],
    queryFn: () => activityLogService.getLogs(filters),
  });
}

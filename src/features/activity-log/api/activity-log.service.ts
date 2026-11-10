import { apiFetch } from "@/shared/api/client";
import type { ActivityLog, ActivityLogFilter, ActivityLogListResult } from "../types";

interface BackendActivityLog {
  id: number;
  user_id?: number | null;
  user_login: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details: string;
  status: string;
  ip_address?: string | null;
  created_at: string;
}

interface BackendActivityLogListResponse {
  items: BackendActivityLog[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

function mapLog(item: BackendActivityLog): ActivityLog {
  return {
    id: item.id,
    userId: item.user_id,
    userLogin: item.user_login,
    userRole: item.user_role,
    action: item.action,
    entityType: item.entity_type,
    entityId: item.entity_id,
    details: item.details,
    status: item.status,
    ipAddress: item.ip_address,
    createdAt: item.created_at,
  };
}

export const activityLogService = {
  async getLogs(filters: ActivityLogFilter = {}): Promise<ActivityLogListResult> {
    const params = new URLSearchParams();
    if (filters.entityType && filters.entityType !== "all") {
      params.append("entity_type", filters.entityType);
    }
    if (filters.action) params.append("action", filters.action);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const res = await apiFetch<BackendActivityLogListResponse>(`/api/activity-logs${queryStr}`);

    return {
      items: res.items.map(mapLog),
      total: res.total,
      page: res.page,
      limit: res.limit,
      totalPages: res.total_pages,
    };
  },
};

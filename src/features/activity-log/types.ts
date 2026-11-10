export interface ActivityLog {
  id: number;
  userId?: number | null;
  userLogin: string;
  userRole: string;
  action: string;
  entityType: "auth" | "movie" | "user" | string;
  entityId?: string | null;
  details: string;
  status: "success" | "failure" | string;
  ipAddress?: string | null;
  createdAt: string;
}

export interface ActivityLogFilter {
  entityType?: string;
  action?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ActivityLogListResult {
  items: ActivityLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

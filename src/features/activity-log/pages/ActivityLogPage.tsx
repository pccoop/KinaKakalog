import { useState } from "react";
import { Navigate } from "react-router-dom";
import { History } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { useAuth } from "@/features/auth/auth-context";
import { useActivityLogs } from "../hooks/useActivityLogs";
import type { ActivityLogFilter } from "../types";
import { ActivityLogFilters } from "../components/ActivityLogFilters";
import { ActivityLogTable } from "../components/ActivityLogTable";
import { Spinner } from "@/shared/ui/spinner";
import { Pagination } from "@/shared/ui/pagination";

export function ActivityLogPage() {
  const { isAdmin } = useAuth();
  const texts = siteConfig.texts.activityLog;

  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  const [filters, setFilters] = useState<ActivityLogFilter>({
    page: 1,
    limit: 15,
  });

  const { data, isLoading, isFetching, refetch } = useActivityLogs(filters);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logs = data?.items ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  return (
    <section className="container py-8 sm:py-12">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <History className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>{texts.title}</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {total}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{texts.description}</p>
          </div>
        </div>
      </div>

      
      <div className="mb-6">
        <ActivityLogFilters
          filters={filters}
          onChange={(newFilters) => setFilters(newFilters)}
          onRefresh={() => refetch()}
          isFetching={isFetching}
        />
      </div>

      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Spinner size="lg" className="mb-3" />
          <p className="text-sm">Загрузка записей журнала…</p>
        </div>
      ) : (
        <>
          <ActivityLogTable logs={logs} isLoading={isLoading} />

          
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={filters.limit ?? 15}
            itemLabel="записи"
            onPageChange={handlePageChange}
            disabled={isFetching}
            className="mt-6"
          />
        </>
      )}
    </section>
  );
}

export default ActivityLogPage;

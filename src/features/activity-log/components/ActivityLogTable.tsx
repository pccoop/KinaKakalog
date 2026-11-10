import { CheckCircle2, XCircle, Clock } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import type { ActivityLog } from "../types";
import { ActivityCategoryBadge } from "./ActivityCategoryBadge";

interface ActivityLogTableProps {
  logs: ActivityLog[];
  isLoading?: boolean;
}

function formatDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return isoStr;
  }
}

export function ActivityLogTable({ logs, isLoading = false }: ActivityLogTableProps) {
  const texts = siteConfig.texts.activityLog;

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="py-3 px-4 whitespace-nowrap">
                {texts.tableColumns.date}
              </th>
              <th scope="col" className="py-3 px-4">
                {texts.tableColumns.user}
              </th>
              <th scope="col" className="py-3 px-4">
                {texts.tableColumns.category}
              </th>
              <th scope="col" className="py-3 px-4">
                {texts.tableColumns.action}
              </th>
              <th scope="col" className="py-3 px-4 min-w-[280px]">
                {texts.tableColumns.details}
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                {texts.tableColumns.status}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {logs.map((log) => {
              const isSuccess = log.status.toLowerCase() === "success";

              return (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  
                  <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-mono text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 opacity-60" />
                      <span>{formatDate(log.createdAt)}</span>
                    </span>
                  </td>

                  
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground font-mono text-xs">
                        {log.userLogin}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {log.userRole}
                      </span>
                    </div>
                  </td>

                  
                  <td className="py-3 px-4 whitespace-nowrap">
                    <ActivityCategoryBadge entityType={log.entityType} />
                  </td>

                  
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs bg-muted/60 px-1.5 py-0.5 rounded text-foreground/80">
                      {log.action}
                    </span>
                  </td>

                  
                  <td className="py-3 px-4 text-foreground leading-snug">
                    <span>{log.details}</span>
                  </td>

                  
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{texts.statusSuccess}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 text-destructive px-2 py-0.5 text-xs font-semibold">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>{texts.statusFailure}</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {logs.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  {texts.emptyList}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

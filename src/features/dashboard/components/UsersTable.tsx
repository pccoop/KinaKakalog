import { useState, useMemo } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  Unlock,
  Edit2,
  Search,
  Clock,
} from "lucide-react";

import { siteConfig } from "@/config/site.config";
import type { User } from "@/features/auth/types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  isLoading: boolean;
  onUnblock: (user: User) => void;
  onEdit: (user: User) => void;
  isUnblockingId?: string | number | null;
}

export function UsersTable({
  users,
  currentUserId,
  isLoading,
  onUnblock,
  onEdit,
  isUnblockingId,
}: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const texts = siteConfig.texts.dashboard;
  const maxAttempts = siteConfig.auth.maxFailedAttempts;

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.login.toLowerCase().includes(term) ||
        u.name.toLowerCase().includes(term),
    );
  }, [users, searchTerm]);

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{texts.tableTitle}</CardTitle>
          <CardDescription>{texts.tableDescription}</CardDescription>
        </div>

        
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder={texts.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-xs"
            aria-label={texts.searchPlaceholder}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th scope="col" className="py-3 px-4">{texts.columns.login}</th>
                <th scope="col" className="py-3 px-4">{texts.columns.name}</th>
                <th scope="col" className="py-3 px-4">{texts.columns.role}</th>
                <th scope="col" className="py-3 px-4">{texts.columns.status}</th>
                <th scope="col" className="py-3 px-4">{texts.columns.attempts}</th>
                <th scope="col" className="py-3 px-4 text-right">{texts.columns.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((u) => {
                const isCurrent = String(u.id) === String(currentUserId);
                const isThisUnblocking = String(isUnblockingId) === String(u.id);

                return (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-foreground">
                      {u.login}
                      {isCurrent && (
                        <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-normal">
                          {texts.youBadge}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-foreground">{u.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                          u.role === siteConfig.roles.admin
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.isBlocked ? (
                        u.blockedUntil && new Date(u.blockedUntil).getTime() > Date.now() ? (
                          <span
                            title={`Блокировка до ${new Date(u.blockedUntil).toLocaleTimeString("ru-RU")}`}
                            className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap"
                          >
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            Временная блокировка
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive whitespace-nowrap">
                            <ShieldAlert className="h-3 w-3" aria-hidden="true" />
                            {texts.statusBlocked}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 whitespace-nowrap">
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          {texts.statusActive}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                      {u.failedAttempts} / {maxAttempts}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.isBlocked && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isThisUnblocking}
                            onClick={() => onUnblock(u)}
                            className="h-8 gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                          >
                            {isThisUnblocking ? (
                              <Spinner size="sm" className="mr-1" />
                            ) : (
                              <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            {texts.unblockButton}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(u)}
                          className="h-8 gap-1 hover:bg-accent"
                        >
                          <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {texts.editButton}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    {texts.noUsersFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

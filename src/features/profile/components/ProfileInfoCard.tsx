import { Shield } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import type { User } from "@/features/auth/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

interface ProfileInfoCardProps {
  user: User | null;
  isAdmin: boolean;
}

export function ProfileInfoCard({ user, isAdmin }: ProfileInfoCardProps) {
  const texts = siteConfig.texts.dashboard;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Информация об аккаунте</CardTitle>
        <CardDescription>
          Основные параметры вашей учётной записи в системе
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[130px_1fr] gap-y-3.5 text-sm">
          <dt className="font-medium text-muted-foreground">Логин:</dt>
          <dd className="font-mono font-semibold text-foreground">
            {user?.login || "—"}
          </dd>

          <dt className="font-medium text-muted-foreground">Имя:</dt>
          <dd className="text-foreground">{user?.name || "—"}</dd>

          <dt className="font-medium text-muted-foreground">Роль в системе:</dt>
          <dd className="text-foreground">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                isAdmin
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <Shield className="h-3 w-3" aria-hidden="true" />
              {user?.role || siteConfig.roles.user}
            </span>
          </dd>

          <dt className="font-medium text-muted-foreground">Статус:</dt>
          <dd>
            {user?.isBlocked ? (
              <span className="text-xs font-semibold text-destructive">
                {texts.statusBlocked}
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600">
                {texts.statusActive}
              </span>
            )}
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
}

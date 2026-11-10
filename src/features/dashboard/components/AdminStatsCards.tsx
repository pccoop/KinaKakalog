import { Users, ShieldCheck, ShieldAlert } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface AdminStatsCardsProps {
  totalUsers: number;
  adminCount: number;
  blockedCount: number;
}

export function AdminStatsCards({
  totalUsers,
  adminCount,
  blockedCount,
}: AdminStatsCardsProps) {
  const texts = siteConfig.texts.dashboard;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {texts.statsTotalUsers}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{totalUsers}</div>
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {texts.statsAdmins}
          </CardTitle>
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{adminCount}</div>
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {texts.statsBlocked}
          </CardTitle>
          <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-destructive">
            {blockedCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

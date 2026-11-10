import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldCheck, UserPlus, RefreshCw } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { useAuth } from "@/features/auth/auth-context";
import type { User as AuthUser } from "@/features/auth/types";
import {
  useAdminUsers,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUnblockUserMutation,
} from "@/features/dashboard/hooks/useAdminUsers";
import { AdminStatsCards } from "@/features/dashboard/components/AdminStatsCards";
import { UsersTable } from "@/features/dashboard/components/UsersTable";
import { AddUserDialog } from "@/features/dashboard/components/AddUserDialog";
import { EditUserDialog } from "@/features/dashboard/components/EditUserDialog";
import { AlertBanner } from "@/shared/ui/alert-banner";
import { Button } from "@/shared/ui/button";

export function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const texts = siteConfig.texts.dashboard;

  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  const { data: users = [], isLoading, isFetching, refetch } = useAdminUsers();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const unblockUserMutation = useUnblockUserMutation();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title: string;
    text: string;
  } | null>(null);

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === siteConfig.roles.admin).length;
  const blockedCount = users.filter((u) => u.isBlocked).length;

  const handleQuickUnblock = async (targetUser: AuthUser) => {
    try {
      const message = await unblockUserMutation.mutateAsync(targetUser.id);
      setFeedback({
        type: "success",
        title: "Блокировка снята",
        text: message,
      });
    } catch {
      setFeedback({
        type: "error",
        title: "Ошибка",
        text: "Не удалось разблокировать пользователя.",
      });
    }
  };

  return (
    <section className="container py-10">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{texts.title}</h1>
            <p className="text-sm text-muted-foreground">{texts.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
            aria-label={texts.refreshButton}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            {texts.refreshButton}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddUserOpen(true)}
            className="gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            {texts.addUserButton}
          </Button>
        </div>
      </div>

      
      {feedback && (
        <div className="mt-6">
          <AlertBanner
            variant={feedback.type}
            title={feedback.title}
            onClose={() => setFeedback(null)}
          >
            {feedback.text}
          </AlertBanner>
        </div>
      )}

      
      <div className="mt-6">
        <AdminStatsCards
          totalUsers={totalUsers}
          adminCount={adminCount}
          blockedCount={blockedCount}
        />
      </div>

      
      <UsersTable
        users={users}
        currentUserId={user?.id}
        isLoading={isLoading}
        onUnblock={handleQuickUnblock}
        onEdit={(u) => setEditingUser(u)}
        isUnblockingId={unblockUserMutation.variables}
      />

      
      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSubmitUser={async (userData) => {
          const res = await createUserMutation.mutateAsync(userData);
          setFeedback({
            type: "success",
            title: "Пользователь добавлен",
            text: `Пользователь «${res.login}» с ролью «${res.role}» успешно создан.`,
          });
          return res;
        }}
      />

      
      <EditUserDialog
        user={editingUser}
        currentUserId={user?.id}
        open={Boolean(editingUser)}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSaveUser={async (id, updateData) => {
          const res = await updateUserMutation.mutateAsync({ id, data: updateData });
          setFeedback({
            type: "success",
            title: "Изменения сохранены",
            text: `Данные пользователя «${res.login}» успешно обновлены.`,
          });
          return res;
        }}
      />
    </section>
  );
}

export default DashboardPage;

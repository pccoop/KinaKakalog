import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import {
  adminUpdateUserSchema,
  type AdminUpdateUserFormValues,
} from "@/features/auth/schemas";
import type { AdminUpdateUserData, User } from "@/features/auth/types";
import { zodResolver } from "@/shared/lib/zod-resolver";
import { ApiError } from "@/shared/api/types";
import { AlertBanner } from "@/shared/ui/alert-banner";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";

interface EditUserDialogProps {
  user: User | null;
  currentUserId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveUser: (id: string | number, data: AdminUpdateUserData) => Promise<User>;
}

export function EditUserDialog({
  user,
  currentUserId,
  open,
  onOpenChange,
  onSaveUser,
}: EditUserDialogProps) {
  const [modalError, setModalError] = useState<string | null>(null);
  const texts = siteConfig.texts.dashboard.editUserDialog;
  const roles = siteConfig.roles;
  const isEditingSelf = Boolean(user && String(user.id) === String(currentUserId));

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminUpdateUserFormValues>({
    resolver: zodResolver(adminUpdateUserSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      role: roles.user,
      isBlocked: false,
    },
  });

  const currentBlocked = watch("isBlocked");

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        role: user.role === roles.admin ? roles.admin : roles.user,
        isBlocked: user.isBlocked,
      });
      setModalError(null);
    }
  }, [user, reset, roles]);

  const handleClose = () => {
    setModalError(null);
    onOpenChange(false);
  };

  const onSubmit = async (values: AdminUpdateUserFormValues) => {
    if (!user) return;

    if (isEditingSelf && values.role !== roles.admin) {
      setModalError(texts.selfDemoteWarning);
      return;
    }

    if (isEditingSelf && values.isBlocked) {
      setModalError(texts.selfBlockWarning);
      return;
    }

    setModalError(null);
    try {
      await onSaveUser(user.id, {
        name: values.name.trim(),
        role: values.role,
        is_blocked: values.isBlocked,
        password: values.password?.trim() || undefined,
      });
      handleClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setModalError(err.message);
      } else {
        setModalError("Не удалось обновить данные пользователя.");
      }
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{texts.title}</DialogTitle>
          <DialogDescription>
            {texts.loginPrefix}
            <strong className="font-mono text-foreground">{user.login}</strong>
          </DialogDescription>
        </DialogHeader>

        {modalError && (
          <AlertBanner
            variant="error"
            title={texts.errorTitle}
            onClose={() => setModalError(null)}
          >
            {modalError}
          </AlertBanner>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField
            id="edit-user-name"
            label={texts.nameLabel}
            required
            error={errors.name?.message}
          >
            <Input
              id="edit-user-name"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "edit-user-name-error" : undefined}
              className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
              {...register("name")}
            />
          </FormField>

          
          <FormField
            id="edit-user-role"
            label={texts.roleLabel}
            required
            error={errors.role?.message}
          >
            <select
              id="edit-user-role"
              disabled={isEditingSelf}
              aria-required="true"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
              {...register("role")}
            >
              <option value={roles.user}>{roles.user}</option>
              <option value={roles.admin}>{roles.admin}</option>
            </select>
            {isEditingSelf && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{texts.selfDemoteWarning}</span>
              </p>
            )}
          </FormField>

          
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-user-blocked"
                disabled={isEditingSelf}
                className="h-4 w-4 rounded border-input disabled:cursor-not-allowed"
                {...register("isBlocked")}
              />
              <label
                htmlFor="edit-user-blocked"
                className={cn(
                  "text-sm font-medium select-none",
                  isEditingSelf ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                )}
              >
                {texts.blockedLabel}
              </label>
            </div>
            {isEditingSelf && currentBlocked && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {texts.selfBlockWarning}
              </p>
            )}
          </div>

          <DialogFooter className="mt-6 pt-2 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              {texts.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner size="sm" className="mr-2" />}
              {texts.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserDialog;

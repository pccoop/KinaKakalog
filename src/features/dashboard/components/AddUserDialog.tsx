import { useState } from "react";
import { useForm } from "react-hook-form";

import { siteConfig } from "@/config/site.config";
import {
  adminCreateUserSchema,
  type AdminCreateUserFormValues,
} from "@/features/auth/schemas";
import type { AdminCreateUserData, User } from "@/features/auth/types";
import { zodResolver } from "@/shared/lib/zod-resolver";
import { ApiError } from "@/shared/api/types";
import { AlertBanner } from "@/shared/ui/alert-banner";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
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

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitUser: (data: AdminCreateUserData) => Promise<User>;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmitUser,
}: AddUserDialogProps) {
  const [modalError, setModalError] = useState<string | null>(null);
  const texts = siteConfig.texts.dashboard.addUserDialog;
  const roles = siteConfig.roles;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreateUserFormValues>({
    resolver: zodResolver(adminCreateUserSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      login: "",
      name: "",
      password: "",
      role: roles.user,
    },
  });

  const handleClose = () => {
    setModalError(null);
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: AdminCreateUserFormValues) => {
    setModalError(null);
    try {
      await onSubmitUser({
        login: values.login.trim(),
        name: values.name.trim(),
        password: values.password,
        role: values.role,
      });
      handleClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setModalError(err.message);
      } else {
        setModalError("Не удалось добавить пользователя. Попробуйте снова.");
      }
    }
  };

  const onInvalid = () => {
    setModalError("Пожалуйста, проверьте правильность заполнения всех обязательных полей.");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{texts.title}</DialogTitle>
          <DialogDescription>{texts.description}</DialogDescription>
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

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
          
          <FormField
            id="admin-new-login"
            label={texts.loginLabel}
            required
            error={errors.login?.message}
          >
            <Input
              id="admin-new-login"
              placeholder="ivan123"
              autoComplete="off"
              aria-required="true"
              aria-invalid={Boolean(errors.login)}
              aria-describedby={errors.login ? "admin-new-login-error" : undefined}
              className={cn(errors.login && "border-destructive focus-visible:ring-destructive")}
              {...register("login")}
            />
          </FormField>

          
          <FormField
            id="admin-new-name"
            label={texts.nameLabel}
            required
            error={errors.name?.message}
          >
            <Input
              id="admin-new-name"
              placeholder="Иван Иванов"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "admin-new-name-error" : undefined}
              className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
              {...register("name")}
            />
          </FormField>

          
          <FormField
            id="admin-new-password"
            label={texts.passwordLabel}
            required
            error={errors.password?.message}
          >
            <PasswordInput
              id="admin-new-password"
              placeholder="Минимум 8 символов (заглавная, строчная, цифра, символ)"
              autoComplete="new-password"
              aria-required="true"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "admin-new-password-error" : undefined}
              className={cn(errors.password && "border-destructive focus-visible:ring-destructive")}
              {...register("password")}
            />
          </FormField>

          
          <FormField
            id="admin-new-role"
            label={texts.roleLabel}
            required
            error={errors.role?.message}
          >
            <select
              id="admin-new-role"
              aria-required="true"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("role")}
            >
              <option value={roles.user}>{roles.user}</option>
              <option value={roles.admin}>{roles.admin}</option>
            </select>
          </FormField>

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

export default AddUserDialog;

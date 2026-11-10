import { useForm } from "react-hook-form";
import { KeyRound, AlertCircle } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas";
import { zodResolver } from "@/shared/lib/zod-resolver";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/shared/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";

interface ChangePasswordCardProps {
  onSubmitPassword: (oldPass: string, newPass: string) => Promise<void>;
  onValidationError: (msg: string) => void;
}

export function ChangePasswordCard({
  onSubmitPassword,
  onValidationError,
}: ChangePasswordCardProps) {
  const texts = siteConfig.texts.auth.profile;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onInvalid = () => {
    onValidationError("Пожалуйста, проверьте правильность заполнения полей пароля.");
  };

  const onSubmit = async (values: ChangePasswordFormValues) => {
    await onSubmitPassword(values.oldPassword, values.newPassword);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" aria-hidden="true" />
          <CardTitle className="text-lg">{texts.changePasswordTitle}</CardTitle>
        </div>
        <CardDescription>
          Требования: от {siteConfig.auth.passwordRules.minLength} символов, заглавная и строчная буквы, цифра и спецсимвол
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-3.5" noValidate>
          <div className="space-y-1">
            <label htmlFor="profile-old-pass" className="text-xs font-medium text-foreground">
              {texts.oldPasswordLabel} <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="profile-old-pass"
              placeholder={texts.oldPasswordPlaceholder}
              autoComplete="current-password"
              className={cn(errors.oldPassword && "border-destructive focus-visible:ring-destructive")}
              {...register("oldPassword")}
            />
            {errors.oldPassword && (
              <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.oldPassword.message}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="profile-new-pass" className="text-xs font-medium text-foreground">
              {texts.newPasswordLabel} <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="profile-new-pass"
              placeholder={texts.newPasswordPlaceholder}
              autoComplete="new-password"
              className={cn(errors.newPassword && "border-destructive focus-visible:ring-destructive")}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.newPassword.message}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="profile-confirm-pass" className="text-xs font-medium text-foreground">
              {texts.confirmPasswordLabel} <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="profile-confirm-pass"
              placeholder={texts.confirmPasswordPlaceholder}
              autoComplete="new-password"
              className={cn(errors.confirmNewPassword && "border-destructive focus-visible:ring-destructive")}
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword && (
              <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.confirmNewPassword.message}</span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gap-2 mt-2"
            size="sm"
          >
            {isSubmitting && <Spinner size="sm" className="text-primary-foreground" />}
            {isSubmitting ? texts.changing : texts.submitChange}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState, useCallback } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/shared/lib/zod-resolver";
import { Lock, User, UserPlus, Info, AlertCircle } from "lucide-react";

import { useAuth } from "@/features/auth/auth-context";
import { authTexts } from "@/features/auth/config/auth-texts";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";
import { PictureCaptcha } from "@/features/auth/components/PictureCaptcha";
import { ApiError } from "@/shared/api/types";
import { AlertBanner } from "@/shared/ui/alert-banner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";

export function RegisterPage() {
  const { isAuthenticated, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const texts = authTexts.register;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      login: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      captchaVerified: false,
    },
  });

  const handleCaptchaSuccess = useCallback(
    (isSuccess: boolean) => {
      setValue("captchaVerified", isSuccess, { shouldValidate: true });
      if (isSuccess) {
        clearErrors("captchaVerified");
        setErrorMessage((prev) =>
          prev === texts.validationError ? null : prev,
        );
      }
    },
    [setValue, clearErrors, texts.validationError],
  );

  const onInvalid = () => {
    setErrorMessage(texts.validationError);
  };

  if (isAuthenticated && !successMessage) {
    return <Navigate to="/profile" replace />;
  }

  const onSubmit = async (values: RegisterFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const msg = await registerUser({
        login: values.login,
        name: values.name,
        password: values.password,
        email: values.email || undefined,
      });

      setSuccessMessage(msg || texts.successMessage);

      setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 700);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(texts.genericError);
      }
    }
  };

  return (
    <section className="container flex justify-center py-10 sm:py-16">
      <Card className="w-full max-w-md shadow-lg border-border/80">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {texts.title}
          </CardTitle>
          <CardDescription>{texts.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {successMessage && (
            <AlertBanner variant="success" title="Успешная регистрация">
              {successMessage}
            </AlertBanner>
          )}

          {errorMessage && (
            <AlertBanner
              variant="error"
              title={
                errors.login || errors.name || errors.password || errors.confirmPassword || errors.captchaVerified
                  ? "Ошибка заполнения формы"
                  : "Ошибка при регистрации"
              }
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </AlertBanner>
          )}

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
            
            <div className="space-y-1.5">
              <label
                htmlFor="register-login"
                className="text-sm font-medium leading-none text-foreground flex items-center gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{texts.loginLabel}</span>
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="register-login"
                placeholder={texts.loginPlaceholder}
                autoComplete="username"
                aria-required="true"
                aria-invalid={!!errors.login}
                aria-describedby={errors.login ? "login-reg-error" : undefined}
                className={cn(errors.login && "border-destructive focus-visible:ring-destructive")}
                {...register("login")}
              />
              {errors.login && (
                <p id="login-reg-error" className="text-xs text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.login.message}</span>
                </p>
              )}
            </div>

            
            <div className="space-y-1.5">
              <label
                htmlFor="register-name"
                className="text-sm font-medium leading-none text-foreground flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{texts.nameLabel}</span>
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="register-name"
                placeholder={texts.namePlaceholder}
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-reg-error" : undefined}
                className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
                {...register("name")}
              />
              {errors.name && (
                <p id="name-reg-error" className="text-xs text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>

            
            <div className="space-y-1.5">
              <label
                htmlFor="register-password"
                className="text-sm font-medium leading-none text-foreground flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{texts.passwordLabel}</span>
                <span className="text-destructive">*</span>
              </label>
              <PasswordInput
                id="register-password"
                placeholder={texts.passwordPlaceholder}
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-reg-error" : undefined}
                className={cn(errors.password && "border-destructive focus-visible:ring-destructive")}
                {...register("password")}
              />
              <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground pt-0.5">
                <Info className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                <span>{texts.passwordHint}</span>
              </div>
              {errors.password && (
                <p id="password-reg-error" className="text-xs text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            
            <div className="space-y-1.5">
              <label
                htmlFor="register-confirm"
                className="text-sm font-medium leading-none text-foreground flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{texts.confirmPasswordLabel}</span>
                <span className="text-destructive">*</span>
              </label>
              <PasswordInput
                id="register-confirm"
                placeholder={texts.confirmPasswordPlaceholder}
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-reg-error" : undefined}
                className={cn(errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p id="confirm-reg-error" className="text-xs text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.confirmPassword.message}</span>
                </p>
              )}
            </div>

            
            <div className="pt-1">
              <PictureCaptcha
                onSuccess={handleCaptchaSuccess}
                hasError={!!errors.captchaVerified}
                errorMessage={errors.captchaVerified?.message}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="w-full gap-2 mt-2"
              size="lg"
            >
              {isSubmitting && <Spinner size="sm" className="text-primary-foreground" />}
              {isSubmitting ? texts.submittingButton : texts.submitButton}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4 text-center text-sm text-muted-foreground">
          <span>{texts.hasAccountPrompt} </span>
          <Link
            to="/login"
            className="ml-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            {texts.loginLink}
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}

export default RegisterPage;

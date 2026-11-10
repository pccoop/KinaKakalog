import { useState, useCallback, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/shared/lib/zod-resolver";
import { Lock, User, AlertCircle, Clock } from "lucide-react";

import { useAuth } from "@/features/auth/auth-context";
import { authTexts } from "@/features/auth/config/auth-texts";
import { siteConfig } from "@/config/site.config";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { PictureCaptcha } from "@/features/auth/components/PictureCaptcha";
import { ApiError } from "@/shared/api/types";
import { AlertBanner } from "@/shared/ui/alert-banner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";

function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function LoginPage() {
  const { isAuthenticated, login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const texts = authTexts.login;

  const defaultDestination = isAdmin ? "/dashboard" : "/profile";
  const from: string =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? defaultDestination;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [lockoutExpired, setLockoutExpired] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      login: "",
      password: "",
      captchaVerified: false,
    },
  });

  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;

    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setLockoutExpired(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutSeconds]);

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
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    if (lockoutSeconds !== null && lockoutSeconds > 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setLockoutExpired(false);

    try {
      const msg = await login({
        login: values.login,
        password: values.password,
        captchaVerified: values.captchaVerified,
      });

      setSuccessMessage(msg);
      setLockoutSeconds(null);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, siteConfig.auth.redirectDelayMs);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);

        const details = err.details as {
          detail?: {
            is_temporary?: boolean;
            remaining_seconds?: number;
            blocked_until?: string;
          };
          remaining_seconds?: number;
          blocked_until?: string;
        } | undefined;

        const lockoutData = details?.detail || details;
        if (lockoutData?.remaining_seconds && lockoutData.remaining_seconds > 0) {
          setLockoutSeconds(lockoutData.remaining_seconds);
        } else if (lockoutData?.blocked_until) {
          const diff = Math.max(
            0,
            Math.ceil((new Date(lockoutData.blocked_until).getTime() - Date.now()) / 1000),
          );
          if (diff > 0) {
            setLockoutSeconds(diff);
          }
        }
      } else {
        setErrorMessage(texts.genericError);
      }
    }
  };

  const isPermanentBlocked =
    errorMessage?.includes("Обратитесь к администратору") &&
    (lockoutSeconds === null || lockoutSeconds <= 0);

  const isLocked = lockoutSeconds !== null && lockoutSeconds > 0;

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
            <AlertBanner variant="success" title="Успешный вход">
              {successMessage}
            </AlertBanner>
          )}

          
          {isLocked && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-200 animate-in fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Clock className="h-5 w-5 animate-pulse" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-semibold tracking-tight">
                    {texts.tempBlockedTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {texts.tempBlockedMessage}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="font-mono text-2xl font-extrabold tracking-wider bg-background border border-amber-500/40 px-3 py-1 rounded-lg text-amber-600 dark:text-amber-400 shadow-sm">
                      {formatSeconds(lockoutSeconds)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {texts.lockoutTimerPrefix}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          
          {lockoutExpired && !isLocked && (
            <AlertBanner
              variant="info"
              title="Доступ возобновлён"
              onClose={() => setLockoutExpired(false)}
            >
              {texts.lockoutExpiredMessage}
            </AlertBanner>
          )}

          
          {errorMessage && !isLocked && (
            <AlertBanner
              variant={isPermanentBlocked ? "warning" : "error"}
              title={
                isPermanentBlocked
                  ? "Доступ заблокирован"
                  : errors.login || errors.password || errors.captchaVerified
                  ? "Ошибка заполнения формы"
                  : "Ошибка авторизации"
              }
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </AlertBanner>
          )}

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
            
            <div className="space-y-1.5">
              <label
                htmlFor="user-login"
                className="text-sm font-medium leading-none text-foreground flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{texts.loginLabel}</span>
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="user-login"
                placeholder={texts.loginPlaceholder}
                autoComplete="username"
                disabled={isLocked}
                aria-required="true"
                aria-invalid={Boolean(errors.login)}
                aria-describedby={errors.login ? "login-error" : undefined}
                className={cn(errors.login && "border-destructive focus-visible:ring-destructive")}
                {...register("login")}
              />
              {errors.login && (
                <p id="login-error" className="text-xs text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.login.message}</span>
                </p>
              )}
            </div>

            
            <div className="space-y-1.5">
              <label
                htmlFor="user-password"
                className="text-sm font-medium leading-none text-foreground flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{texts.passwordLabel}</span>
                <span className="text-destructive">*</span>
              </label>
              <PasswordInput
                id="user-password"
                placeholder={texts.passwordPlaceholder}
                autoComplete="current-password"
                disabled={isLocked}
                aria-required="true"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={cn(errors.password && "border-destructive focus-visible:ring-destructive")}
                {...register("password")}
              />
              {errors.password && (
                <p id="password-error" className="text-xs text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.password.message}</span>
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
              disabled={isSubmitting || !!successMessage || isLocked}
              className="w-full gap-2 mt-2"
              size="lg"
            >
              {isSubmitting && <Spinner size="sm" className="text-primary-foreground" />}
              {isLocked ? (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin text-primary-foreground/70" />
                  <span>Подождите ({formatSeconds(lockoutSeconds)})</span>
                </span>
              ) : isSubmitting ? (
                texts.submittingButton
              ) : (
                texts.submitButton
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4 text-center text-sm text-muted-foreground">
          <span>{texts.noAccountPrompt} </span>
          <Link
            to="/register"
            className="ml-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            {texts.registerLink}
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}

export default LoginPage;

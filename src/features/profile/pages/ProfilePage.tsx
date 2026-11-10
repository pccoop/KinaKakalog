import { useState } from "react";
import { Link } from "react-router-dom";
import { User as UserIcon, ArrowRight } from "lucide-react";

import { useAuth } from "@/features/auth/auth-context";
import { siteConfig } from "@/config/site.config";
import { ApiError } from "@/shared/api/types";
import { AlertBanner } from "@/shared/ui/alert-banner";
import { Button } from "@/shared/ui/button";
import { ProfileInfoCard } from "../components/ProfileInfoCard";
import { ChangePasswordCard } from "../components/ChangePasswordCard";

export function ProfilePage() {
  const { user, isAdmin, changePassword } = useAuth();
  const texts = siteConfig.texts.auth.profile;

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title: string;
    text: string;
  } | null>(null);

  const handleChangePassword = async (oldPass: string, newPass: string) => {
    setFeedback(null);
    try {
      const msg = await changePassword(oldPass, newPass);
      setFeedback({
        type: "success",
        title: "Успешно",
        text: msg || texts.successChange,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setFeedback({
          type: "error",
          title: "Ошибка",
          text: err.message,
        });
      } else {
        setFeedback({
          type: "error",
          title: "Ошибка",
          text: "Не удалось изменить пароль. Проверьте правильность текущего пароля.",
        });
      }
    }
  };

  const handleValidationError = (msg: string) => {
    setFeedback({
      type: "error",
      title: "Ошибка заполнения",
      text: msg,
    });
  };

  return (
    <section className="container py-10 max-w-4xl">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserIcon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{texts.title}</h1>
            <p className="text-sm text-muted-foreground">
              {texts.description}
            </p>
          </div>
        </div>

        {isAdmin && (
          <Button asChild className="gap-2 self-start sm:self-auto">
            <Link to="/dashboard">
              {texts.adminPanelLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
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

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <ProfileInfoCard user={user} isAdmin={isAdmin} />
        <ChangePasswordCard
          onSubmitPassword={handleChangePassword}
          onValidationError={handleValidationError}
        />
      </div>
    </section>
  );
}

export default ProfilePage;

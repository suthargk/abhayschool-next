"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { LanguageSelect } from "@/components/language-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { PASSWORD_RULES, isStrongPassword } from "@/lib/password";
import { getInitials } from "@/lib/teacher";

export function TeacherSettingsForm({ profile }) {
  const t = useTranslations("teacherSettings");
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl ?? "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const passwordRules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    label: t(`password.passwordRequirements.${rule.key}`),
  }));

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/teacher/settings/photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t("photo.uploadFailed"));
      setPhotoUrl(data.url);
      toast.success(t("photo.updated"));
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError(t("password.currentPasswordRequired"));
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setPasswordError(t("password.passwordWeak"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("password.passwordMismatch"));
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/teacher/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t("password.defaultError"));
      toast.success(t("password.updated"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setUpdatingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold">{t("photo.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("photo.description")}</p>
        <div className="mt-4 flex items-center gap-4">
          <Avatar className="size-16">
            {photoUrl ? <AvatarImage src={photoUrl} alt="" /> : null}
            <AvatarFallback className="text-lg">
              {getInitials(profile?.firstName, profile?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={uploadingPhoto}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingPhoto ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("photo.uploading")}
                </>
              ) : (
                t("photo.upload")
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold">{t("password.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("password.description")}</p>
        <form onSubmit={handlePasswordSubmit} className="mt-4 max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("password.currentPasswordLabel")}</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("password.newPasswordLabel")}</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">{t("password.passwordHelp")}</p>
            <PasswordChecklist password={newPassword} rules={passwordRules} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("password.confirmPasswordLabel")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {passwordError ? <p className="text-sm text-destructive">{passwordError}</p> : null}
          <Button type="submit" disabled={updatingPassword}>
            {updatingPassword ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("password.submitting")}
              </>
            ) : (
              t("password.submit")
            )}
          </Button>
        </form>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold">{t("preferences.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("preferences.description")}</p>
        <div className="mt-4 max-w-[220px] space-y-2">
          <Label>{t("preferences.languageLabel")}</Label>
          <LanguageSelect />
        </div>
      </section>
    </div>
  );
}

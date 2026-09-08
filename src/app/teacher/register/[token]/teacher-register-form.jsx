"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { PASSWORD_RULES, isStrongPassword } from "@/lib/password";

export function TeacherRegisterForm({ email, token, classes = [], subjects: subjectOptions = [] }) {
  const t = useTranslations("teacherAuth.register");
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [classValues, setClassValues] = useState([]);
  const [subjectValues, setSubjectValues] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    label: t(`passwordRequirements.${rule.key}`),
  }));

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isStrongPassword(password)) {
      setError(t("passwordWeak"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    if (classValues.length === 0) {
      setError(t("classesRequired"));
      return;
    }
    if (subjectValues.length === 0) {
      setError(t("subjectsRequired"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/teacher/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          phone,
          password,
          classes: classValues,
          subjects: subjectValues,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t("defaultError"));
        return;
      }
      router.push("/teacher/login?registered=1");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-sm text-muted-foreground">{t("subheading")}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input id="email" type="email" value={email} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("phoneLabel")}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder={t("phonePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("passwordLabel")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">{t("passwordHelp")}</p>
            <PasswordChecklist password={password} rules={passwordRules} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
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

          <div className="space-y-2">
            <Label htmlFor="register-classes">{t("classesLabel")}</Label>
            <MultiSelect
              id="register-classes"
              options={classes.map((c) => ({ value: c.value, label: c.label }))}
              values={classValues}
              onChange={setClassValues}
              placeholder={t("classesPlaceholder")}
              emptyText={t("classesEmpty")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-subjects">{t("subjectsLabel")}</Label>
            <MultiSelect
              id="register-subjects"
              options={subjectOptions.map((s) => ({ value: s.label, label: s.label }))}
              values={subjectValues}
              onChange={setSubjectValues}
              placeholder={t("subjectsPlaceholder")}
              emptyText={t("subjectsEmpty")}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("submitting") : t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}

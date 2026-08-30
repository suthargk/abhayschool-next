"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TeacherFaqForm({ initialItem }) {
  const t = useTranslations("teacherFaq.form");
  const tCommon = useTranslations("common.actions");
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [question, setQuestion] = useState(initialItem?.question ?? "");
  const [answer, setAnswer] = useState(initialItem?.answer ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { question, answer };

    try {
      const res = await fetch(
        isEdit ? `/api/teacher/faq/${initialItem.id}` : "/api/teacher/faq",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailed"));
      router.push("/teacher/faq");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="faq-question">{t("questionLabel")}</Label>
        <Input
          id="faq-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          placeholder={t("questionPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="faq-answer">{t("answerLabel")}</Label>
        <Textarea
          id="faq-answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          rows={5}
          placeholder={t("answerPlaceholder")}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? t("saving") : isEdit ? t("saveChanges") : t("publish")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/teacher/faq")}>
          {tCommon("cancel")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t("publishNote")}</p>
    </form>
  );
}

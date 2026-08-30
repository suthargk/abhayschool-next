"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TeacherLibraryForm({ initialItem, classes }) {
  const t = useTranslations("teacherLibrary.form");
  const tCommon = useTranslations("common.actions");
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [bookClass, setBookClass] = useState(initialItem?.class ?? classes[0]?.value ?? "");
  const [bookName, setBookName] = useState(initialItem?.bookName ?? "");
  const [subject, setSubject] = useState(initialItem?.subject ?? "");
  const [publication, setPublication] = useState(initialItem?.publication ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { class: bookClass, bookName, subject, publication };

    try {
      const res = await fetch(
        isEdit ? `/api/teacher/library/${initialItem.id}` : "/api/teacher/library",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailed"));
      router.push("/teacher/library");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (classes.length === 0) {
    return (
      <p className="max-w-3xl text-sm text-muted-foreground">
        {t("noClasses")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="library-class">{t("classLabel")}</Label>
        <Select value={bookClass} onValueChange={setBookClass}>
          <SelectTrigger id="library-class">
            <SelectValue placeholder={t("classPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="library-book-name">{t("bookNameLabel")}</Label>
        <Input
          id="library-book-name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          required
          placeholder={t("bookNamePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="library-subject">{t("subjectLabel")}</Label>
        <Input
          id="library-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder={t("subjectPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="library-publication">{t("publicationLabel")}</Label>
        <Input
          id="library-publication"
          value={publication}
          onChange={(e) => setPublication(e.target.value)}
          required
          placeholder={t("publicationPlaceholder")}
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
        <Button type="button" variant="outline" onClick={() => router.push("/teacher/library")}>
          {tCommon("cancel")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("publishNote")}
      </p>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
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

export function LibraryForm({ initialItem, classes, defaultClass, canPublish }) {
  const router = useRouter();
  const t = useTranslations("superAdminLibrary.form");
  const tCommon = useTranslations("common.actions");
  const tStatus = useTranslations("common.status");
  const isEdit = Boolean(initialItem);

  const [klass, setKlass] = useState(
    initialItem?.class ?? defaultClass ?? classes[0]?.value,
  );
  const [bookName, setBookName] = useState(initialItem?.bookName ?? "");
  const [subject, setSubject] = useState(initialItem?.subject ?? "");
  const [publication, setPublication] = useState(initialItem?.publication ?? "");
  const [status, setStatus] = useState(initialItem?.status ?? "DRAFT");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { class: klass, bookName, subject, publication };

    try {
      const res = await fetch(
        isEdit ? `/api/super-admin/library/${initialItem.id}` : "/api/super-admin/library",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailed"));
      router.push("/super-admin/academic/library");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish() {
    setPublishing(true);
    setError("");
    try {
      const res = await fetch(`/api/super-admin/library/${initialItem.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: status !== "PUBLISHED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("updateStatusFailed"));
      setStatus(data.item.status);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {isEdit ? (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{status === "PUBLISHED" ? tStatus("published") : tStatus("draft")}</Badge>
          {canPublish ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={publishing}
              onClick={handleTogglePublish}
            >
              {publishing ? t("updating") : status === "PUBLISHED" ? tCommon("unpublish") : tCommon("publish")}
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="library-class">{t("classLabel")}</Label>
        <Select value={klass} onValueChange={setKlass}>
          <SelectTrigger id="library-class">
            <SelectValue />
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

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? tCommon("saving") : isEdit ? t("saveChanges") : t("saveDraft")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/super-admin/academic/library")}
        >
          {tCommon("cancel")}
        </Button>
      </div>
    </form>
  );
}

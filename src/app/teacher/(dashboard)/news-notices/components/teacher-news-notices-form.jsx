"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FileText, Loader2, Paperclip, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/news-notices/rich-text-editor";
import { CATEGORIES, CATEGORY_LABEL_KEYS } from "@/lib/news-notices/categories";
import { currentAcademicYear } from "@/lib/news-notices/academic-year";

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TeacherNewsNoticeForm({ initialItem }) {
  const t = useTranslations("teacherNewsNotices.form");
  const tCategories = useTranslations("newsNotices.categories");
  const tCommon = useTranslations("common.actions");
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [type, setType] = useState(initialItem?.type ?? "NEWS");
  const [category, setCategory] = useState(initialItem?.category ?? "GENERAL");
  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [summary, setSummary] = useState(initialItem?.summary ?? "");
  const [content, setContent] = useState(initialItem?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialItem?.coverImageUrl ?? "");
  const [pinned, setPinned] = useState(initialItem?.pinned ?? false);
  const [featured, setFeatured] = useState(initialItem?.featured ?? false);
  const [academicYear, setAcademicYear] = useState(
    initialItem?.academicYear ?? currentAcademicYear(),
  );
  const [expiresAt, setExpiresAt] = useState(initialItem?.expiresAt ?? null);
  const [eventDate, setEventDate] = useState(initialItem?.eventDate ?? null);
  const [eventTime, setEventTime] = useState(initialItem?.eventTime ?? "");
  const [venue, setVenue] = useState(initialItem?.venue ?? "");
  const [attachments, setAttachments] = useState(initialItem?.attachments ?? []);

  const [uploading, setUploading] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/teacher/news-notices/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("uploadFailed"));
      setCoverImageUrl(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleAttachmentChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAttachment(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/teacher/news-notices/attachments/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("uploadFailed"));
      setAttachments((prev) => [
        ...prev,
        {
          fileName: data.fileName,
          fileUrl: data.url,
          fileType: data.fileType,
          fileSize: data.fileSize,
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingAttachment(false);
      e.target.value = "";
    }
  }

  function removeAttachment(index) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      type,
      category,
      title,
      summary,
      content,
      coverImageUrl,
      pinned,
      featured,
      academicYear,
      expiresAt,
      eventDate,
      eventTime,
      venue,
      attachments,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/teacher/news-notices/${initialItem.id}` : "/api/teacher/news-notices",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailed"));
      router.push("/teacher/news-notices");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <Label>{t("contentTypeLabel")}</Label>
        <div className="flex gap-2">
          {[
            { value: "NEWS", label: t("typeNews") },
            { value: "NOTICE", label: t("typeNotice") },
          ].map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={type === option.value ? "default" : "outline"}
              onClick={() => setType(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">{t("categoryLabel")}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder={t("categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {tCategories(CATEGORY_LABEL_KEYS[c.value])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic-year">{t("academicYearLabel")}</Label>
          <Input
            id="academic-year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder={t("academicYearPlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">{t("titleLabel")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={t("titlePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">{t("summaryLabel")}</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder={t("summaryPlaceholder")}
          rows={3}
        />
      </div>

      <div className="flex flex-wrap gap-6 rounded-md border p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox checked={pinned} onCheckedChange={(v) => setPinned(v === true)} />
          {t("pinnedLabel")}
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox checked={featured} onCheckedChange={(v) => setFeatured(v === true)} />
          {t("featuredLabel")}
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover-image">{t("coverImageLabel")}</Label>
        {coverImageUrl ? (
          <div className="relative w-full max-w-sm overflow-hidden rounded-md border">
            <Image
              src={coverImageUrl}
              alt=""
              width={640}
              height={360}
              className="h-auto w-full object-cover"
              unoptimized
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 size-7"
              onClick={() => setCoverImageUrl("")}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <Input
            id="cover-image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleImageChange}
            disabled={uploading}
          />
        )}
        {uploading ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> {t("uploading")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>{t("contentLabel")}</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder={t("contentPlaceholder")}
        />
      </div>

      <div className="space-y-4 rounded-md border p-4">
        <Label className="text-sm font-semibold">{t("eventDetailsLabel")}</Label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="event-date" className="text-xs font-normal text-muted-foreground">
              {t("eventDateLabel")}
            </Label>
            <DatePicker value={eventDate} onChange={setEventDate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-time" className="text-xs font-normal text-muted-foreground">
              {t("eventTimeLabel")}
            </Label>
            <Input
              id="event-time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder={t("eventTimePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue" className="text-xs font-normal text-muted-foreground">
              {t("venueLabel")}
            </Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder={t("venuePlaceholder")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry-date">{t("expiryDateLabel")}</Label>
        <p className="text-xs text-muted-foreground">
          {t("expiryDateHelp")}
        </p>
        <DatePicker value={expiresAt} onChange={setExpiresAt} />
      </div>

      <div className="space-y-2">
        <Label>{t("attachmentsLabel")}</Label>
        {attachments.length > 0 ? (
          <ul className="space-y-2">
            {attachments.map((a, i) => (
              <li
                key={`${a.fileUrl}-${i}`}
                className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{a.fileName}</span>
                  {a.fileSize ? (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatFileSize(a.fileSize)}
                    </span>
                  ) : null}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  onClick={() => removeAttachment(i)}
                >
                  <X className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/png,image/jpeg,image/webp"
            onChange={handleAttachmentChange}
            disabled={uploadingAttachment}
            className="max-w-sm"
          />
          {uploadingAttachment ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <Paperclip className="size-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || uploading || uploadingAttachment}>
          {saving ? t("saving") : isEdit ? t("saveChanges") : t("publish")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/teacher/news-notices")}
        >
          {tCommon("cancel")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("publishNote")}
      </p>
    </form>
  );
}

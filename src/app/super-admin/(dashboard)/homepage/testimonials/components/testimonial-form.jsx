"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Loader2, UserRound, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TestimonialForm({ initialItem, canPublish }) {
  const t = useTranslations("superAdminTestimonials.form");
  const tCommon = useTranslations("common.actions");
  const tStatus = useTranslations("common.status");
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [name, setName] = useState(initialItem?.name ?? "");
  const [designation, setDesignation] = useState(initialItem?.designation ?? "");
  const [quote, setQuote] = useState(initialItem?.quote ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialItem?.photoUrl ?? "");
  const [status, setStatus] = useState(initialItem?.status ?? "DRAFT");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/super-admin/testimonials/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("uploadFailedError"));
      setPhotoUrl(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { name, designation, quote, photoUrl };

    try {
      const res = await fetch(
        isEdit
          ? `/api/super-admin/testimonials/${initialItem.id}`
          : "/api/super-admin/testimonials",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailedError"));
      router.push("/super-admin/homepage/testimonials");
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
      const res = await fetch(`/api/super-admin/testimonials/${initialItem.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: status !== "PUBLISHED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("statusUpdateFailedError"));
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
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {status === "PUBLISHED" ? tStatus("published") : tStatus("draft")}
          </Badge>
          {canPublish ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={publishing}
              onClick={handleTogglePublish}
            >
              {publishing
                ? t("updating")
                : status === "PUBLISHED"
                  ? tCommon("unpublish")
                  : tCommon("publish")}
            </Button>
          ) : null}
        </div>
      ) : null}

      {isEdit && initialItem.source === "PARENT" ? (
        <p className="rounded-md border border-dashed bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          {initialItem.phone
            ? t("parentSubmissionNoticeWithPhone", { phone: initialItem.phone })
            : t("parentSubmissionNotice")}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="testimonial-photo">{t("photoLabel")}</Label>
        {photoUrl ? (
          <div className="relative size-24 overflow-hidden rounded-full border">
            <Image src={photoUrl} alt="" fill className="object-cover" unoptimized />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-0 top-0 size-7 rounded-full"
              onClick={() => setPhotoUrl("")}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full border bg-muted">
              <UserRound className="size-6 text-muted-foreground" />
            </span>
            <Input
              id="testimonial-photo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handlePhotoChange}
              disabled={uploadingPhoto}
              className="max-w-xs"
            />
          </div>
        )}
        {uploadingPhoto ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> {t("uploading")}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{t("photoHelp")}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="testimonial-name">{t("nameLabel")}</Label>
          <Input
            id="testimonial-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="testimonial-designation">{t("designationLabel")}</Label>
          <Input
            id="testimonial-designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder={t("designationPlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="testimonial-quote">{t("quoteLabel")}</Label>
        <Textarea
          id="testimonial-quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
          rows={5}
          placeholder={t("quotePlaceholder")}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || uploadingPhoto}>
          {saving ? t("saving") : isEdit ? t("saveChanges") : t("saveDraft")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/super-admin/homepage/testimonials")}
        >
          {tCommon("cancel")}
        </Button>
      </div>
    </form>
  );
}

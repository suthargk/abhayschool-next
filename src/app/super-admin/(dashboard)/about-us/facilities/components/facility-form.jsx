"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Loader2, Sparkles, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

export function FacilityForm({ initialItem, initialSection, canPublish }) {
  const t = useTranslations("superAdminFacilities.form");
  const tSections = useTranslations("superAdminFacilities.sections");
  const tCommon = useTranslations("common.actions");
  const tStatus = useTranslations("common.status");
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [section, setSection] = useState(initialItem?.section ?? initialSection ?? "OVERVIEW");
  const [icon, setIcon] = useState(initialItem?.icon ?? "");
  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [summary, setSummary] = useState(initialItem?.summary ?? "");
  const [description, setDescription] = useState(initialItem?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initialItem?.imageUrl ?? "");
  const [featured, setFeatured] = useState(initialItem?.featured ?? false);
  const [status, setStatus] = useState(initialItem?.status ?? "DRAFT");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const isFaq = section === "FAQ";
  const isOverview = section === "OVERVIEW";

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/super-admin/facilities/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("uploadFailed"));
      setImageUrl(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      section,
      icon,
      title,
      summary,
      description,
      imageUrl,
      featured: isOverview ? featured : false,
    };

    try {
      const res = await fetch(
        isEdit
          ? `/api/super-admin/facilities/${initialItem.id}`
          : "/api/super-admin/facilities",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailed"));
      router.push(`/super-admin/about-us/facilities?section=${section}`);
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
      const res = await fetch(`/api/super-admin/facilities/${initialItem.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: status !== "PUBLISHED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("statusUpdateFailed"));
      setStatus(data.item.status);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
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
        <Label htmlFor="facility-section">{t("sectionLabel")}</Label>
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger id="facility-section" className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {tSections(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{t("sectionHelp")}</p>
      </div>

      {!isFaq ? (
        <div className="space-y-2">
          <Label htmlFor="facility-image">{t("photoLabel")}</Label>
          {imageUrl ? (
            <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
              <Image src={imageUrl} alt="" fill className="object-cover" unoptimized />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 size-7 rounded-full"
                onClick={() => setImageUrl("")}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <Sparkles className="size-6 text-muted-foreground" />
              </span>
              <Input
                id="facility-image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="max-w-xs"
              />
            </div>
          )}
          {uploadingImage ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> {t("uploading")}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{t("photoHelp")}</p>
          )}
        </div>
      ) : null}

      {!isFaq ? (
        <div className="space-y-2">
          <Label htmlFor="facility-icon">{t("iconLabel")}</Label>
          <Input
            id="facility-icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder={t("iconPlaceholder")}
            className="max-w-24"
          />
          <p className="text-xs text-muted-foreground">{t("iconHelp")}</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="facility-title">{isFaq ? t("questionLabel") : t("titleLabel")}</Label>
        <Input
          id="facility-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={isFaq ? t("questionPlaceholder") : t("titlePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facility-summary">{isFaq ? t("answerLabel") : t("summaryLabel")}</Label>
        <Textarea
          id="facility-summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder={isFaq ? t("answerPlaceholder") : t("summaryPlaceholder")}
          rows={isFaq ? 4 : 2}
        />
      </div>

      {isOverview ? (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="facility-featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(Boolean(checked))}
            />
            <Label htmlFor="facility-featured" className="font-normal">
              {t("featuredLabel")}
            </Label>
          </div>

          {featured ? (
            <div className="space-y-2">
              <Label htmlFor="facility-description">{t("highlightsLabel")}</Label>
              <Textarea
                id="facility-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("highlightsPlaceholder")}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">{t("highlightsHelp")}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || uploadingImage}>
          {saving ? tCommon("saving") : isEdit ? t("saveChanges") : t("saveDraft")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/super-admin/about-us/facilities?section=${section}`)}
        >
          {tCommon("cancel")}
        </Button>
      </div>
    </form>
  );
}

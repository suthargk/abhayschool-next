"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Loader2, UserRound, X } from "lucide-react";

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
import {
  TOPPER_CLASSES,
  TOPPER_STREAMS,
  TOPPER_CLASS_LABEL_KEYS,
  TOPPER_STREAM_LABEL_KEYS,
} from "@/data/topper-classes";

export function TeacherToppersForm({ initialItem }) {
  const t = useTranslations("teacherToppers.form");
  const tActions = useTranslations("common.actions");
  const tToppers = useTranslations("achievements.featuredToppers");
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [name, setName] = useState(initialItem?.name ?? "");
  const [topperClass, setTopperClass] = useState(initialItem?.class ?? "CLASS_X");
  const [stream, setStream] = useState(initialItem?.stream ?? "");
  const [year, setYear] = useState(
    initialItem?.year != null ? String(initialItem.year) : String(new Date().getFullYear()),
  );
  const [rank, setRank] = useState(initialItem?.rank != null ? String(initialItem.rank) : "1");
  const [percentage, setPercentage] = useState(
    initialItem?.percentage != null ? String(initialItem.percentage) : "",
  );
  const [marksObtained, setMarksObtained] = useState(
    initialItem?.marksObtained != null ? String(initialItem.marksObtained) : "",
  );
  const [marksTotal, setMarksTotal] = useState(
    initialItem?.marksTotal != null ? String(initialItem.marksTotal) : "",
  );
  const [photoUrl, setPhotoUrl] = useState(initialItem?.photoUrl ?? "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleClassChange(value) {
    setTopperClass(value);
    if (value === "CLASS_X") setStream("");
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/teacher/toppers/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("uploadFailed"));
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

    const payload = {
      name,
      class: topperClass,
      stream: topperClass === "CLASS_XII" ? stream || null : null,
      year: year === "" ? null : Number(year),
      rank: rank === "" ? 1 : Number(rank),
      percentage: percentage === "" ? null : Number(percentage),
      marksObtained: marksObtained === "" ? null : Number(marksObtained),
      marksTotal: marksTotal === "" ? null : Number(marksTotal),
      photoUrl,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/teacher/toppers/${initialItem.id}` : "/api/teacher/toppers",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailed"));
      router.push("/teacher/toppers");
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
        <Label htmlFor="topper-photo">{t("photoLabel")}</Label>
        {photoUrl ? (
          <div className="relative size-32 overflow-hidden rounded-full border">
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
              id="topper-photo"
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
          <Label htmlFor="topper-name">{t("nameLabel")}</Label>
          <Input
            id="topper-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topper-year">{t("yearLabel")}</Label>
          <Input
            id="topper-year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            placeholder={t("yearPlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="topper-class">{t("classLabel")}</Label>
          <Select value={topperClass} onValueChange={handleClassChange}>
            <SelectTrigger id="topper-class">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPPER_CLASSES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {tToppers(TOPPER_CLASS_LABEL_KEYS[c.value])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {topperClass === "CLASS_XII" ? (
          <div className="space-y-2">
            <Label htmlFor="topper-stream">{t("streamLabel")}</Label>
            <Select value={stream} onValueChange={setStream}>
              <SelectTrigger id="topper-stream">
                <SelectValue placeholder={t("streamPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {TOPPER_STREAMS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {tToppers(TOPPER_STREAM_LABEL_KEYS[s.value])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="topper-rank">{t("rankLabel")}</Label>
          <Input
            id="topper-rank"
            type="number"
            min="1"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder={t("rankPlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="topper-percentage">{t("percentageLabel")}</Label>
          <Input
            id="topper-percentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            required
            placeholder={t("percentagePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topper-marks-obtained">{t("marksObtainedLabel")}</Label>
          <Input
            id="topper-marks-obtained"
            type="number"
            min="0"
            value={marksObtained}
            onChange={(e) => setMarksObtained(e.target.value)}
            placeholder={t("marksObtainedPlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topper-marks-total">{t("marksTotalLabel")}</Label>
          <Input
            id="topper-marks-total"
            type="number"
            min="0"
            value={marksTotal}
            onChange={(e) => setMarksTotal(e.target.value)}
            placeholder={t("marksTotalPlaceholder")}
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || uploadingPhoto}>
          {saving ? t("saving") : isEdit ? t("saveChanges") : t("publish")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/teacher/toppers")}>
          {tActions("cancel")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t("publishNote")}</p>
    </form>
  );
}

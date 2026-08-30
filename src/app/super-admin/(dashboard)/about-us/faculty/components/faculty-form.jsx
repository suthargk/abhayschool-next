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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FACULTY_CATEGORIES, FACULTY_CATEGORY_LABEL_KEYS } from "@/data/faculty-categories";

import { TagInput } from "./tag-input";

export function FacultyForm({ initialItem, canPublish }) {
  const t = useTranslations("superAdminFaculty.form");
  const tCategories = useTranslations("superAdminFaculty.categories");
  const tCommon = useTranslations("common.actions");
  const tStatus = useTranslations("common.status");
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [name, setName] = useState(initialItem?.name ?? "");
  const [designation, setDesignation] = useState(initialItem?.designation ?? "");
  const [department, setDepartment] = useState(initialItem?.department ?? "");
  const [category, setCategory] = useState(initialItem?.category ?? "TEACHING");
  const [subjects, setSubjects] = useState(initialItem?.subjects ?? []);
  const [grades, setGrades] = useState(initialItem?.grades ?? []);
  const [areasOfInterest, setAreasOfInterest] = useState(initialItem?.areasOfInterest ?? []);
  const [achievements, setAchievements] = useState(initialItem?.achievements ?? []);
  const [qualification, setQualification] = useState(initialItem?.qualification ?? "");
  const [bio, setBio] = useState(initialItem?.bio ?? "");
  const [experienceYears, setExperienceYears] = useState(
    initialItem?.experienceYears != null ? String(initialItem.experienceYears) : "",
  );
  const [email, setEmail] = useState(initialItem?.email ?? "");
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
      const res = await fetch("/api/super-admin/faculty/upload", {
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
      designation,
      department,
      category,
      subjects,
      grades,
      areasOfInterest,
      achievements,
      qualification,
      bio,
      experienceYears: experienceYears === "" ? null : Number(experienceYears),
      email,
      photoUrl,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/super-admin/faculty/${initialItem.id}` : "/api/super-admin/faculty",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailed"));
      router.push("/super-admin/about-us/faculty");
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
      const res = await fetch(`/api/super-admin/faculty/${initialItem.id}/publish`, {
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
        <Label htmlFor="faculty-photo">{t("photoLabel")}</Label>
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
              id="faculty-photo"
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
          <Label htmlFor="faculty-name">{t("nameLabel")}</Label>
          <Input
            id="faculty-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faculty-designation">{t("designationLabel")}</Label>
          <Input
            id="faculty-designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
            placeholder={t("designationPlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="faculty-category">{t("categoryLabel")}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="faculty-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FACULTY_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {tCategories(FACULTY_CATEGORY_LABEL_KEYS[c.value])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{t("categoryHelp")}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="faculty-department">{t("departmentLabel")}</Label>
          <Input
            id="faculty-department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder={t("departmentPlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="faculty-experience">{t("experienceLabel")}</Label>
        <Input
          id="faculty-experience"
          type="number"
          min="0"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          placeholder={t("experiencePlaceholder")}
          className="max-w-xs"
        />
      </div>

      <TagInput
        id="faculty-subjects"
        label={t("subjectsLabel")}
        values={subjects}
        onChange={setSubjects}
        placeholder={t("subjectsPlaceholder")}
      />

      <TagInput
        id="faculty-grades"
        label={t("gradesLabel")}
        values={grades}
        onChange={setGrades}
        placeholder={t("gradesPlaceholder")}
      />

      <div className="space-y-2">
        <Label htmlFor="faculty-qualification">{t("qualificationLabel")}</Label>
        <Input
          id="faculty-qualification"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          placeholder={t("qualificationPlaceholder")}
        />
      </div>

      <TagInput
        id="faculty-areas-of-interest"
        label={t("areasOfInterestLabel")}
        values={areasOfInterest}
        onChange={setAreasOfInterest}
        placeholder={t("areasOfInterestPlaceholder")}
      />

      <TagInput
        id="faculty-achievements"
        label={t("achievementsLabel")}
        values={achievements}
        onChange={setAchievements}
        placeholder={t("achievementsPlaceholder")}
      />

      <div className="space-y-2">
        <Label htmlFor="faculty-email">{t("emailLabel")}</Label>
        <Input
          id="faculty-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
        />
        <p className="text-xs text-muted-foreground">{t("emailHelp")}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="faculty-bio">{t("bioLabel")}</Label>
        <Textarea
          id="faculty-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("bioPlaceholder")}
          rows={4}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || uploadingPhoto}>
          {saving ? tCommon("saving") : isEdit ? t("saveChanges") : t("saveDraft")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/super-admin/about-us/faculty")}
        >
          {tCommon("cancel")}
        </Button>
      </div>
    </form>
  );
}

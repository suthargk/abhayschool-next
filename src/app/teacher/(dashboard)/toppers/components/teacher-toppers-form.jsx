"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
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
import { TOPPER_CLASSES, TOPPER_STREAMS } from "@/data/topper-classes";

export function TeacherToppersForm({ initialItem }) {
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
      if (!res.ok) throw new Error(data.error || "Upload failed");
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
      if (!res.ok) throw new Error(data.error || "Save failed");
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
        <Label htmlFor="topper-photo">Photo</Label>
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
            <Loader2 className="size-3 animate-spin" /> Uploading…
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Optional. The card just skips the image if left blank.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="topper-name">Name</Label>
          <Input
            id="topper-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Aarav Sharma"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topper-year">Year</Label>
          <Input
            id="topper-year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            placeholder="e.g. 2026"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="topper-class">Class</Label>
          <Select value={topperClass} onValueChange={handleClassChange}>
            <SelectTrigger id="topper-class">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPPER_CLASSES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {topperClass === "CLASS_XII" ? (
          <div className="space-y-2">
            <Label htmlFor="topper-stream">Stream</Label>
            <Select value={stream} onValueChange={setStream}>
              <SelectTrigger id="topper-stream">
                <SelectValue placeholder="Select stream" />
              </SelectTrigger>
              <SelectContent>
                {TOPPER_STREAMS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="topper-rank">Rank</Label>
          <Input
            id="topper-rank"
            type="number"
            min="1"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="topper-percentage">Percentage</Label>
          <Input
            id="topper-percentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            required
            placeholder="e.g. 97.8"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topper-marks-obtained">Marks obtained</Label>
          <Input
            id="topper-marks-obtained"
            type="number"
            min="0"
            value={marksObtained}
            onChange={(e) => setMarksObtained(e.target.value)}
            placeholder="e.g. 489"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topper-marks-total">Marks out of</Label>
          <Input
            id="topper-marks-total"
            type="number"
            min="0"
            value={marksTotal}
            onChange={(e) => setMarksTotal(e.target.value)}
            placeholder="e.g. 500"
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
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/teacher/toppers")}>
          Cancel
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        This topper is published immediately and appears on the school website right away.
      </p>
    </form>
  );
}

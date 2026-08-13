"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
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
import { CATEGORIES } from "@/lib/news-notices/categories";
import { currentAcademicYear } from "@/lib/news-notices/academic-year";

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function NewsNoticeForm({ initialItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [type, setType] = useState(initialItem?.type ?? "NEWS");
  const [category, setCategory] = useState(initialItem?.category ?? "GENERAL");
  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [summary, setSummary] = useState(initialItem?.summary ?? "");
  const [content, setContent] = useState(initialItem?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialItem?.coverImageUrl ?? "",
  );
  const [pinned, setPinned] = useState(initialItem?.pinned ?? false);
  const [featured, setFeatured] = useState(initialItem?.featured ?? false);
  const [academicYear, setAcademicYear] = useState(
    initialItem?.academicYear ?? currentAcademicYear(),
  );
  const [expiresAt, setExpiresAt] = useState(initialItem?.expiresAt ?? null);
  const [eventDate, setEventDate] = useState(initialItem?.eventDate ?? null);
  const [eventTime, setEventTime] = useState(initialItem?.eventTime ?? "");
  const [venue, setVenue] = useState(initialItem?.venue ?? "");
  const [attachments, setAttachments] = useState(
    initialItem?.attachments ?? [],
  );

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
      const res = await fetch("/api/super-admin/news-notices/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
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
      const res = await fetch(
        "/api/super-admin/news-notices/attachments/upload",
        { method: "POST", body: formData },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
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
        isEdit
          ? `/api/super-admin/news-notices/${initialItem.id}`
          : "/api/super-admin/news-notices",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/super-admin/news-notices");
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
        <Label>Content type</Label>
        <div className="flex gap-2">
          {[
            { value: "NEWS", label: "News" },
            { value: "NOTICE", label: "Notice" },
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
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic-year">Academic year</Label>
          <Input
            id="academic-year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="2026-27"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="New product update"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Short description</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="A one or two sentence summary shown in lists."
          rows={3}
        />
      </div>

      <div className="flex flex-wrap gap-6 rounded-md border p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox checked={pinned} onCheckedChange={(v) => setPinned(v === true)} />
          Pinned — keep at the top of the list
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox
            checked={featured}
            onCheckedChange={(v) => setFeatured(v === true)}
          />
          Featured — highlight on the homepage
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover-image">Cover image</Label>
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
            <Loader2 className="size-3 animate-spin" /> Uploading…
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Write the article or notice here…"
        />
      </div>

      <div className="space-y-4 rounded-md border p-4">
        <Label className="text-sm font-semibold">
          Event details (optional)
        </Label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="event-date" className="text-xs font-normal text-muted-foreground">
              Event date
            </Label>
            <DatePicker value={eventDate} onChange={setEventDate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-time" className="text-xs font-normal text-muted-foreground">
              Time
            </Label>
            <Input
              id="event-time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder="9:00 AM – 1:00 PM"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue" className="text-xs font-normal text-muted-foreground">
              Venue
            </Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="School Auditorium"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry-date">Expiry date (optional)</Label>
        <p className="text-xs text-muted-foreground">
          After this date the notice moves out of the active list but stays
          available in the archive.
        </p>
        <DatePicker value={expiresAt} onChange={setExpiresAt} />
      </div>

      <div className="space-y-2">
        <Label>Attachments</Label>
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
          {saving ? "Saving…" : isEdit ? "Save changes" : "Save draft"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/super-admin/news-notices")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

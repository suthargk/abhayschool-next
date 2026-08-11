"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/news-notices/rich-text-editor";

export function AcademicPostForm({ initialItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [summary, setSummary] = useState(initialItem?.summary ?? "");
  const [content, setContent] = useState(initialItem?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialItem?.coverImageUrl ?? "",
  );
  const [uploading, setUploading] = useState(false);
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
      const res = await fetch("/api/super-admin/academic-blog/upload", {
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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { title, summary, content, coverImageUrl };

    try {
      const res = await fetch(
        isEdit
          ? `/api/super-admin/academic-blog/${initialItem.id}`
          : "/api/super-admin/academic-blog",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/super-admin/academic/blog");
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Preparing for board exams"
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
          placeholder="Write the post here…"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Save draft"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/super-admin/academic/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

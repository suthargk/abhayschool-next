"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarIcon, GripVertical, Loader2, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GALLERY_CATEGORIES } from "@/data/gallery-categories";
import { cn } from "@/lib/utils";

function toDate(value) {
  if (!value) return undefined;
  return new Date(value);
}

export function GalleryAlbumForm({ initialItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [description, setDescription] = useState(initialItem?.description ?? "");
  const [eventDate, setEventDate] = useState(toDate(initialItem?.eventDate));
  const [coverImageUrl, setCoverImageUrl] = useState(initialItem?.coverImageUrl ?? "");
  const [category, setCategory] = useState(initialItem?.category ?? "EVENTS");
  const [featured, setFeatured] = useState(initialItem?.featured ?? false);
  const [images, setImages] = useState(
    () =>
      initialItem?.images?.map((image) => ({ key: image.id, url: image.imageUrl })) ?? []
  );
  const [dragIndex, setDragIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  async function handleFilesChange(e) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/super-admin/gallery/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to upload ${file.name}`);
        uploaded.push({ key: crypto.randomUUID(), url: data.url });
      }
      setImages((prev) => {
        const next = [...prev, ...uploaded];
        setCoverImageUrl((cover) => cover || next[0]?.url || "");
        return next;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(key) {
    setImages((prev) => {
      const removed = prev.find((image) => image.key === key);
      const next = prev.filter((image) => image.key !== key);
      if (removed?.url === coverImageUrl) {
        setCoverImageUrl(next[0]?.url || "");
      }
      return next;
    });
  }

  function reorder(fromIndex, toIndex) {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!eventDate) {
      setError("Event date is required");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      title,
      description,
      eventDate: eventDate ? eventDate.toISOString() : "",
      coverImageUrl,
      category,
      featured,
      images: images.map((image, index) => ({ url: image.url, position: index })),
    };

    try {
      const res = await fetch(
        isEdit
          ? `/api/super-admin/gallery/${initialItem.id}`
          : "/api/super-admin/gallery",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/super-admin/gallery");
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
          placeholder="Annual Sports Day 2026"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-date" className="block">Event date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="event-date"
              type="button"
              variant="outline"
              className={cn(
                "w-48 justify-start text-left font-normal",
                !eventDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {eventDate ? format(eventDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={eventDate}
              onSelect={setEventDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GALLERY_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pb-2.5">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={(checked) => setFeatured(checked === true)}
          />
          <Label htmlFor="featured" className="font-normal">
            Featured album
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short description of the event."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.key}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== index) {
                    reorder(dragIndex, index);
                  }
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-md border",
                  dragIndex === index && "opacity-50"
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-1 bg-gradient-to-b from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="cursor-grab text-white">
                    <GripVertical className="size-4" />
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="size-6"
                    onClick={() => removeImage(image.key)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => setCoverImageUrl(image.url)}
                  className={cn(
                    "absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
                    image.url === coverImageUrl
                      ? "bg-primary text-primary-foreground"
                      : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Star className="size-3" fill={image.url === coverImageUrl ? "currentColor" : "none"} />
                  {image.url === coverImageUrl ? "Cover" : "Set cover"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No photos yet. Add some below.
          </p>
        )}

        <div>
          <Input
            ref={fileInputRef}
            id="photos"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            onChange={handleFilesChange}
            disabled={uploading}
          />
          {uploading ? (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> Uploading…
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Drag photos to reorder. Click the star to set the cover photo.
            </p>
          )}
        </div>
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
          onClick={() => router.push("/super-admin/gallery")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

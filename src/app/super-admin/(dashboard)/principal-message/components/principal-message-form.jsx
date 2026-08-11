"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/news-notices/rich-text-editor";

export function PrincipalMessageForm({ initialItem, canPublish }) {
  const router = useRouter();

  const [principalName, setPrincipalName] = useState(
    initialItem?.principalName ?? "",
  );
  const [content, setContent] = useState(initialItem?.content ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialItem?.photoUrl ?? "");
  const [signatureUrl, setSignatureUrl] = useState(
    initialItem?.signatureUrl ?? "",
  );
  const [status, setStatus] = useState(initialItem?.status ?? "DRAFT");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/super-admin/principal-message/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError("");
    try {
      setPhotoUrl(await uploadImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handleSignatureChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSignature(true);
    setError("");
    try {
      setSignatureUrl(await uploadImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingSignature(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/super-admin/principal-message", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principalName,
          content,
          photoUrl,
          signatureUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setStatus(data.item.status);
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
      const res = await fetch("/api/super-admin/principal-message/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: status !== "PUBLISHED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
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
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {status === "PUBLISHED" ? "Published" : "Draft"}
        </Badge>
        {canPublish && initialItem ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={publishing}
            onClick={handleTogglePublish}
          >
            {publishing
              ? "Updating…"
              : status === "PUBLISHED"
                ? "Unpublish"
                : "Publish"}
          </Button>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="principal-name">Principal&apos;s name</Label>
        <Input
          id="principal-name"
          value={principalName}
          onChange={(e) => setPrincipalName(e.target.value)}
          placeholder="e.g. Jane Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="principal-photo">Photo</Label>
        {photoUrl ? (
          <div className="relative w-40 overflow-hidden rounded-md border">
            <Image
              src={photoUrl}
              alt=""
              width={320}
              height={320}
              className="h-auto w-full object-cover"
              unoptimized
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-1 top-1 size-7"
              onClick={() => setPhotoUrl("")}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <Input
            id="principal-photo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handlePhotoChange}
            disabled={uploadingPhoto}
          />
        )}
        {uploadingPhoto ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Uploading…
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="principal-signature">Signature</Label>
        {signatureUrl ? (
          <div className="relative w-56 overflow-hidden rounded-md border bg-white p-2">
            <Image
              src={signatureUrl}
              alt=""
              width={400}
              height={150}
              className="h-auto w-full object-contain"
              unoptimized
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-1 top-1 size-7"
              onClick={() => setSignatureUrl("")}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <Input
            id="principal-signature"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleSignatureChange}
            disabled={uploadingSignature}
          />
        )}
        {uploadingSignature ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Uploading…
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Message</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Write the Principal's message here…"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={saving || uploadingPhoto || uploadingSignature}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}

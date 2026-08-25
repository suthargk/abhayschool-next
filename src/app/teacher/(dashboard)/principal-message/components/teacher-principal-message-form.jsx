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

export function TeacherPrincipalMessageForm({ initialItem }) {
  const router = useRouter();

  const [principalName, setPrincipalName] = useState(initialItem?.principalName ?? "");
  const [designation, setDesignation] = useState(initialItem?.designation ?? "");
  const [quote, setQuote] = useState(initialItem?.quote ?? "");
  const [content, setContent] = useState(initialItem?.content ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialItem?.photoUrl ?? "");
  const [signatureUrl, setSignatureUrl] = useState(initialItem?.signatureUrl ?? "");
  const [principalSince, setPrincipalSince] = useState(initialItem?.principalSince ?? "");
  const [experienceYears, setExperienceYears] = useState(initialItem?.experienceYears ?? "");
  const [qualification, setQualification] = useState(initialItem?.qualification ?? "");
  const [interests, setInterests] = useState(initialItem?.interests ?? "");
  const [videoUrl, setVideoUrl] = useState(initialItem?.videoUrl ?? "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/teacher/principal-message/upload", {
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
      const res = await fetch("/api/teacher/principal-message", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principalName,
          designation,
          quote,
          content,
          photoUrl,
          signatureUrl,
          principalSince,
          experienceYears,
          qualification,
          interests,
          videoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="principal-name">Principal&apos;s name</Label>
          <Input
            id="principal-name"
            value={principalName}
            onChange={(e) => setPrincipalName(e.target.value)}
            placeholder="e.g. Dr. Jane Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="principal-designation">Designation</Label>
          <Input
            id="principal-designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g. Principal, Shri Abhay Nobles Senior Secondary School"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="principal-quote">Hero quote</Label>
        <Textarea
          id="principal-quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="A short line shown alongside the photo, e.g. “Education is not simply about achieving academic success…”"
          rows={2}
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
          placeholder="Dear Students, Parents, and Members of Our School Community, … Try covering: a welcome, your educational philosophy, character &amp; values, academics, and your vision for the future — using subheadings to break it up."
        />
      </div>

      <div className="space-y-4 rounded-md border p-4">
        <p className="text-sm font-medium">About the Principal (short profile)</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="principal-since">Principal since</Label>
            <Input
              id="principal-since"
              type="number"
              value={principalSince}
              onChange={(e) => setPrincipalSince(e.target.value)}
              placeholder="2021"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="principal-experience">Experience (years)</Label>
            <Input
              id="principal-experience"
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="20"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="principal-qualification">Qualification</Label>
            <Input
              id="principal-qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="M.Ed., Ph.D. in Education"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="principal-interests">Areas of interest</Label>
          <Input
            id="principal-interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Student development, educational leadership, STEM education"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="principal-video">Video message URL (YouTube or Vimeo, optional)</Label>
        <Input
          id="principal-video"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || uploadingPhoto || uploadingSignature}>
          {saving ? "Saving…" : "Publish"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Changes are published immediately and appear on the school website right away.
      </p>
    </form>
  );
}

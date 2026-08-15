"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Loader2, Paperclip, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { RichTextEditor } from "@/components/news-notices/rich-text-editor";
import { SUBJECTS } from "@/lib/homework/subjects";

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function HomeworkForm({ initialItem, classes }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [homeworkClass, setHomeworkClass] = useState(
    initialItem?.class ?? classes[0]?.value,
  );
  const [subject, setSubject] = useState(
    initialItem?.subject ?? SUBJECTS[0].value,
  );
  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [content, setContent] = useState(initialItem?.content ?? "");
  const [teacherName, setTeacherName] = useState(
    initialItem?.teacherName ?? "",
  );
  const [assignedDate, setAssignedDate] = useState(
    initialItem?.assignedDate ?? new Date().toISOString(),
  );
  const [dueDate, setDueDate] = useState(initialItem?.dueDate ?? null);
  const [attachments, setAttachments] = useState(
    initialItem?.attachments ?? [],
  );

  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadTeachers() {
      try {
        const res = await fetch("/api/super-admin/faculty");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load teachers");
        if (!cancelled) {
          setTeachers(
            (data.items ?? []).filter((f) => f.category === "TEACHING"),
          );
        }
      } catch {
        // Non-fatal: teacher dropdown falls back to just the current value.
      } finally {
        if (!cancelled) setLoadingTeachers(false);
      }
    }
    loadTeachers();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAttachmentChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAttachment(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        "/api/super-admin/homework/attachments/upload",
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

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      class: homeworkClass,
      subject,
      title,
      content,
      teacherName,
      assignedDate,
      dueDate,
      attachments,
    };

    try {
      const res = await fetch(
        isEdit
          ? `/api/super-admin/homework/${initialItem.id}`
          : "/api/super-admin/homework",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/super-admin/homework");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select value={homeworkClass} onValueChange={setHomeworkClass}>
            <SelectTrigger id="class">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Chapter 5 — Linear Equations"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teacher-name">Teacher</Label>
        <Select
          value={teacherName || undefined}
          onValueChange={setTeacherName}
          disabled={loadingTeachers}
        >
          <SelectTrigger id="teacher-name">
            <SelectValue
              placeholder={
                loadingTeachers ? "Loading teachers…" : "Select a teacher"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {teacherName && !teachers.some((t) => t.name === teacherName) ? (
              <SelectItem value={teacherName}>{teacherName}</SelectItem>
            ) : null}
            {teachers.map((t) => (
              <SelectItem key={t.id} value={t.name}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Assigned date</Label>
          <DatePicker value={assignedDate} onChange={setAssignedDate} />
        </div>
        <div className="space-y-2">
          <Label>Due date</Label>
          <DatePicker value={dueDate} onChange={setDueDate} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Instructions</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Describe the assignment, pages, and expectations…"
        />
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
        <Button type="submit" disabled={saving || uploadingAttachment}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Save draft"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/super-admin/homework")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

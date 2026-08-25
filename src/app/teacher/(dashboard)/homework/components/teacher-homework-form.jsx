"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { classLabel } from "@/lib/classes";

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TeacherHomeworkForm({ initialItem, assignments, classes }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const assignedClasses = useMemo(
    () => [...new Set(assignments.map((a) => a.class))],
    [assignments],
  );

  const [homeworkClass, setHomeworkClass] = useState(
    initialItem?.class ?? assignedClasses[0] ?? "",
  );

  const subjectsForClass = useMemo(
    () => assignments.filter((a) => a.class === homeworkClass).map((a) => a.subject),
    [assignments, homeworkClass],
  );

  const [subject, setSubject] = useState(initialItem?.subject ?? subjectsForClass[0] ?? "");
  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [content, setContent] = useState(initialItem?.content ?? "");
  const [assignedDate, setAssignedDate] = useState(
    initialItem?.assignedDate ?? new Date().toISOString(),
  );
  const [dueDate, setDueDate] = useState(initialItem?.dueDate ?? null);
  const [attachments, setAttachments] = useState(initialItem?.attachments ?? []);

  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function onClassChange(value) {
    setHomeworkClass(value);
    const firstSubject = assignments.find((a) => a.class === value)?.subject ?? "";
    setSubject(firstSubject);
  }

  async function handleAttachmentChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAttachment(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/teacher/homework/attachments/upload", {
        method: "POST",
        body: formData,
      });
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
      assignedDate,
      dueDate,
      attachments,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/teacher/homework/${initialItem.id}` : "/api/teacher/homework",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/teacher/homework");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (assignedClasses.length === 0) {
    return (
      <p className="max-w-3xl text-sm text-muted-foreground">
        You don&apos;t have any classes/subjects assigned yet. Contact an admin to get set up
        before posting homework.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select value={homeworkClass} onValueChange={onClassChange}>
            <SelectTrigger id="class">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {assignedClasses.map((value) => (
                <SelectItem key={value} value={value}>
                  {classLabel(classes, value)}
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
              {subjectsForClass.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
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
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/teacher/homework")}>
          Cancel
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        This homework is published immediately and appears on the school website right away.
      </p>
    </form>
  );
}

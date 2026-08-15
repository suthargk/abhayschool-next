"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { WEEKDAYS } from "@/data/weekdays";

export function TimeTableForm({ initialItem, classes, defaultClass, canPublish }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [klass, setKlass] = useState(
    initialItem?.class ?? defaultClass ?? classes[0]?.value,
  );
  const [day, setDay] = useState(initialItem?.day ?? WEEKDAYS[0].value);
  const [period, setPeriod] = useState(initialItem?.period ?? "");
  const [subject, setSubject] = useState(initialItem?.subject ?? "");
  const [teacherName, setTeacherName] = useState(initialItem?.teacherName ?? "");
  const [startTime, setStartTime] = useState(initialItem?.startTime ?? "");
  const [endTime, setEndTime] = useState(initialItem?.endTime ?? "");
  const [status, setStatus] = useState(initialItem?.status ?? "DRAFT");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      class: klass,
      day,
      period: Number(period),
      subject,
      teacherName,
      startTime,
      endTime,
    };

    try {
      const res = await fetch(
        isEdit
          ? `/api/super-admin/time-table/${initialItem.id}`
          : "/api/super-admin/time-table",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/super-admin/academic/time-table");
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
      const res = await fetch(`/api/super-admin/time-table/${initialItem.id}/publish`, {
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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {isEdit ? (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{status === "PUBLISHED" ? "Published" : "Draft"}</Badge>
          {canPublish ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={publishing}
              onClick={handleTogglePublish}
            >
              {publishing ? "Updating…" : status === "PUBLISHED" ? "Unpublish" : "Publish"}
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time-table-class">Class</Label>
          <Select value={klass} onValueChange={setKlass}>
            <SelectTrigger id="time-table-class">
              <SelectValue />
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
          <Label htmlFor="time-table-day">Day</Label>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger id="time-table-day">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time-table-period">Period</Label>
          <Input
            id="time-table-period"
            type="number"
            min="1"
            step="1"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
            placeholder="e.g. 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time-table-subject">Subject</Label>
          <Input
            id="time-table-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="e.g. Mathematics"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time-table-teacher">Teacher (optional)</Label>
        <Input
          id="time-table-teacher"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder="e.g. Mrs. Sharma"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time-table-start">Start time (optional)</Label>
          <Input
            id="time-table-start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time-table-end">End time (optional)</Label>
          <Input
            id="time-table-end"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Save draft"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/super-admin/academic/time-table")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

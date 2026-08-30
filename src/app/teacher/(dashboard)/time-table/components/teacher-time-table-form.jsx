"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

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
import { WEEKDAYS, WEEKDAY_LABEL_KEYS } from "@/data/weekdays";

export function TeacherTimeTableForm({ initialItem, classes }) {
  const t = useTranslations("teacherTimeTable.form");
  const tActions = useTranslations("common.actions");
  const tWeekdays = useTranslations("academics.timeTable");
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [klass, setKlass] = useState(initialItem?.class ?? classes[0]?.value ?? "");
  const [day, setDay] = useState(initialItem?.day ?? WEEKDAYS[0].value);
  const [period, setPeriod] = useState(initialItem?.period ?? "");
  const [subject, setSubject] = useState(initialItem?.subject ?? "");
  const [teacherName, setTeacherName] = useState(initialItem?.teacherName ?? "");
  const [startTime, setStartTime] = useState(initialItem?.startTime ?? "");
  const [endTime, setEndTime] = useState(initialItem?.endTime ?? "");
  const [saving, setSaving] = useState(false);
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
        isEdit ? `/api/teacher/time-table/${initialItem.id}` : "/api/teacher/time-table",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("saveFailed"));
      router.push("/teacher/time-table");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (classes.length === 0) {
    return <p className="max-w-xl text-sm text-muted-foreground">{t("noClasses")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time-table-class">{t("classLabel")}</Label>
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
          <Label htmlFor="time-table-day">{t("dayLabel")}</Label>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger id="time-table-day">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {tWeekdays(`weekdays.${WEEKDAY_LABEL_KEYS[d.value]}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time-table-period">{t("periodLabel")}</Label>
          <Input
            id="time-table-period"
            type="number"
            min="1"
            step="1"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
            placeholder={t("periodPlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time-table-subject">{t("subjectLabel")}</Label>
          <Input
            id="time-table-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder={t("subjectPlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time-table-teacher">{t("teacherLabel")}</Label>
        <Input
          id="time-table-teacher"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder={t("teacherPlaceholder")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time-table-start">{t("startTimeLabel")}</Label>
          <Input
            id="time-table-start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time-table-end">{t("endTimeLabel")}</Label>
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
          {saving ? t("saving") : isEdit ? t("saveChanges") : t("publish")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/teacher/time-table")}>
          {tActions("cancel")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t("publishNote")}</p>
    </form>
  );
}

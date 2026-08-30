"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { Textarea } from "@/components/ui/textarea";

// Values are stored/submitted as-is (English) for backend consistency; only
// the displayed label is translated via the `classOptions` message key below.
const CLASS_OPTIONS = [
  { value: "Nursery", labelKey: "nursery" },
  { value: "LKG", labelKey: "lkg" },
  { value: "UKG", labelKey: "ukg" },
  { value: "Class I", labelKey: "classI" },
  { value: "Class II", labelKey: "classII" },
  { value: "Class III", labelKey: "classIII" },
  { value: "Class IV", labelKey: "classIV" },
  { value: "Class V", labelKey: "classV" },
  { value: "Class VI", labelKey: "classVI" },
  { value: "Class VII", labelKey: "classVII" },
  { value: "Class VIII", labelKey: "classVIII" },
  { value: "Class IX", labelKey: "classIX" },
  { value: "Class X", labelKey: "classX" },
  { value: "Class XI", labelKey: "classXI" },
  { value: "Class XII", labelKey: "classXII" },
];

const INITIAL_FORM = {
  studentName: "",
  dateOfBirth: "",
  gender: "",
  classAppliedFor: "",
  parentName: "",
  phone: "",
  email: "",
  address: "",
  previousSchool: "",
  message: "",
};

export function AdmissionForm() {
  const t = useTranslations("admissions.form");
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admissions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("defaultError"));
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-14 text-center">
        <CheckCircle2 className="size-10 text-emerald-500" />
        <h2 className="text-xl font-semibold tracking-tight">{t("successHeading")}</h2>
        <p className="max-w-sm text-muted-foreground">
          {t("successMessage")}
          {form.email ? ` ${t("successEmailNote")}` : ""}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">{t("studentNameLabel")}</Label>
          <Input
            id="studentName"
            value={form.studentName}
            onChange={(e) => update("studentName", e.target.value)}
            required
            placeholder={t("studentNamePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">{t("dateOfBirthLabel")}</Label>
          <DatePicker
            id="dateOfBirth"
            value={form.dateOfBirth}
            onChange={(iso) => update("dateOfBirth", iso ?? "")}
            placeholder={t("dateOfBirthPlaceholder")}
            captionLayout="dropdown"
            startMonth={new Date(new Date().getFullYear() - 20, 0)}
            endMonth={new Date()}
            disabled={{ after: new Date() }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gender">{t("genderLabel")}</Label>
          <Select value={form.gender} onValueChange={(value) => update("gender", value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder={t("genderPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">{t("genderOptions.male")}</SelectItem>
              <SelectItem value="Female">{t("genderOptions.female")}</SelectItem>
              <SelectItem value="Other">{t("genderOptions.other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="classAppliedFor">{t("classAppliedForLabel")}</Label>
          <Select
            value={form.classAppliedFor}
            onValueChange={(value) => update("classAppliedFor", value)}
            required
          >
            <SelectTrigger id="classAppliedFor">
              <SelectValue placeholder={t("classPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(`classOptions.${option.labelKey}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="parentName">{t("parentNameLabel")}</Label>
          <Input
            id="parentName"
            value={form.parentName}
            onChange={(e) => update("parentName", e.target.value)}
            required
            placeholder={t("parentNamePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phoneLabel")}</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
            placeholder={t("phonePlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="previousSchool">{t("previousSchoolLabel")}</Label>
          <Input
            id="previousSchool"
            value={form.previousSchool}
            onChange={(e) => update("previousSchool", e.target.value)}
            placeholder={t("previousSchoolPlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t("addressLabel")}</Label>
        <Input
          id="address"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder={t("addressPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("messageLabel")}</Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={4}
          placeholder={t("messagePlaceholder")}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

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

const CLASS_OPTIONS = [
  "Nursery",
  "LKG",
  "UKG",
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
  "Class X",
  "Class XI",
  "Class XII",
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
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
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
        <h2 className="text-xl font-semibold tracking-tight">Thank you!</h2>
        <p className="max-w-sm text-muted-foreground">
          We&apos;ve received your admission enquiry. Our admissions team will contact you
          shortly.
          {form.email ? " We've also sent a confirmation to your email." : ""}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">Student&apos;s name *</Label>
          <Input
            id="studentName"
            value={form.studentName}
            onChange={(e) => update("studentName", e.target.value)}
            required
            placeholder="e.g. Aarav Sharma"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of birth</Label>
          <DatePicker
            id="dateOfBirth"
            value={form.dateOfBirth}
            onChange={(iso) => update("dateOfBirth", iso ?? "")}
            placeholder="Select date of birth"
            captionLayout="dropdown"
            startMonth={new Date(new Date().getFullYear() - 20, 0)}
            endMonth={new Date()}
            disabled={{ after: new Date() }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={form.gender} onValueChange={(value) => update("gender", value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="classAppliedFor">Class applying for *</Label>
          <Select
            value={form.classAppliedFor}
            onValueChange={(value) => update("classAppliedFor", value)}
            required
          >
            <SelectTrigger id="classAppliedFor">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="parentName">Parent/guardian name *</Label>
          <Input
            id="parentName"
            value={form.parentName}
            onChange={(e) => update("parentName", e.target.value)}
            required
            placeholder="e.g. Rohit Sharma"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile number *</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
            placeholder="10-digit mobile number"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="previousSchool">Previous school</Label>
          <Input
            id="previousSchool"
            value={form.previousSchool}
            onChange={(e) => update("previousSchool", e.target.value)}
            placeholder="If applicable"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Current residential address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Anything else you&apos;d like us to know?</Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={4}
          placeholder="Optional"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}

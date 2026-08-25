"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TeacherFaqForm({ initialItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [question, setQuestion] = useState(initialItem?.question ?? "");
  const [answer, setAnswer] = useState(initialItem?.answer ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { question, answer };

    try {
      const res = await fetch(
        isEdit ? `/api/teacher/faq/${initialItem.id}` : "/api/teacher/faq",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/teacher/faq");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="faq-question">Question</Label>
        <Input
          id="faq-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          placeholder="e.g. What is the admission process?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="faq-answer">Answer</Label>
        <Textarea
          id="faq-answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          rows={5}
          placeholder="Write a clear, concise answer shown in the accordion."
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/teacher/faq")}>
          Cancel
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        This FAQ is published immediately and appears on the school website right away.
      </p>
    </form>
  );
}

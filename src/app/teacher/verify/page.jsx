"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RESEND_COOLDOWN_SECONDS = 30;

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function onResend() {
    setResendMessage("");
    setError("");
    setResending(true);
    try {
      const res = await fetch("/api/teacher/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Couldn't resend the code. Try again.");
        return;
      }
      setResendMessage("A new code has been sent.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setResending(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "That code is incorrect or has expired");
        return;
      }

      router.push("/teacher/login?verified=1");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            {email
              ? `Enter the 6-digit code we emailed to ${email}.`
              : "Enter the 6-digit code we emailed you."}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Verification code</Label>
            <Input
              id="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              maxLength={6}
              placeholder="123456"
              className="text-center text-lg tracking-widest"
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading || !email}>
            {loading ? "Verifying…" : "Verify"}
          </Button>
        </form>
        <div className="text-center text-sm">
          {resendMessage ? <p className="text-muted-foreground">{resendMessage}</p> : null}
          {resendCooldown > 0 ? (
            <p className="text-muted-foreground">Resend code in {resendCooldown}s</p>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={resending || !email}
              className="font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {resending ? "Resending…" : "Resend code"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeacherVerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}

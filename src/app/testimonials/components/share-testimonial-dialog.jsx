"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const RESEND_COOLDOWN_SECONDS = 30;

const STEPS = {
  FORM: "form",
  OTP: "otp",
  SUCCESS: "success",
};

const initialState = {
  name: "",
  designation: "",
  quote: "",
  phone: "",
};

export function ShareTestimonialDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(STEPS.FORM);
  const [form, setForm] = useState(initialState);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  function resetAndClose(nextOpen) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setStep(STEPS.FORM);
      setForm(initialState);
      setOtp("");
      setError("");
      setCooldown(0);
    }
  }

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function requestOtp(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.quote.trim() || !form.phone.trim()) {
      setError("Please fill in your name, phone number, and testimonial.");
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch("/api/testimonials/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't send the verification code");
      setStep(STEPS.OTP);
      startCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingOtp(false);
    }
  }

  async function resendOtp() {
    if (cooldown > 0) return;
    setError("");
    setSendingOtp(true);
    try {
      const res = await fetch("/api/testimonials/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't send the verification code");
      startCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingOtp(false);
    }
  }

  async function verifyAndSubmit(e) {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Enter the code we texted you.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't submit your testimonial");
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogTrigger asChild>
        <Button>
          <MessageSquarePlus className="size-4" />
          Share Your Story
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === STEPS.FORM ? (
          <form onSubmit={requestOtp} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Share your experience</DialogTitle>
              <DialogDescription>
                Tell other families what it&apos;s been like. We&apos;ll text a one-time code to
                verify your number before your story is reviewed and published.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="share-name">Your name</Label>
              <Input
                id="share-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-designation">You are a...</Label>
              <Input
                id="share-designation"
                value={form.designation}
                onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                placeholder="e.g. Parent of Class VI student"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-quote">Your testimonial</Label>
              <Textarea
                id="share-quote"
                value={form.quote}
                onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                required
                rows={4}
                maxLength={1000}
                placeholder="What has your experience with the school been like?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-phone">Mobile number</Label>
              <Input
                id="share-phone"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
                placeholder="10-digit mobile number"
              />
              <p className="text-xs text-muted-foreground">
                Used only to verify you and never shown publicly.
              </p>
            </div>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <DialogFooter>
              <Button type="submit" disabled={sendingOtp}>
                {sendingOtp ? "Sending code…" : "Send verification code"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}

        {step === STEPS.OTP ? (
          <form onSubmit={verifyAndSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Verify your number</DialogTitle>
              <DialogDescription>
                Enter the code we texted to {form.phone}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="share-otp">Verification code</Label>
              <Input
                id="share-otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                placeholder="6-digit code"
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <DialogFooter className="items-center sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={cooldown > 0 || sendingOtp}
                onClick={resendOtp}
              >
                {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Verify & submit"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}

        {step === STEPS.SUCCESS ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="size-10 text-emerald-500" />
            <DialogHeader>
              <DialogTitle>Thank you!</DialogTitle>
              <DialogDescription>
                Your testimonial has been submitted and will appear here once our team reviews
                and approves it.
              </DialogDescription>
            </DialogHeader>
            <Button variant="outline" onClick={() => resetAndClose(false)}>
              Close
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

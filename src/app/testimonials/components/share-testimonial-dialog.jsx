"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("testimonials.shareDialog");
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
      setError(t("form.missingFieldsError"));
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
      if (!res.ok) throw new Error(data.error || t("form.otpRequestError"));
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
      if (!res.ok) throw new Error(data.error || t("form.otpRequestError"));
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
      setError(t("otp.emptyCodeError"));
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
      if (!res.ok) throw new Error(data.error || t("otp.submitError"));
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
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === STEPS.FORM ? (
          <form onSubmit={requestOtp} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("form.title")}</DialogTitle>
              <DialogDescription>{t("form.description")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="share-name">{t("form.nameLabel")}</Label>
              <Input
                id="share-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                placeholder={t("form.namePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-designation">{t("form.designationLabel")}</Label>
              <Input
                id="share-designation"
                value={form.designation}
                onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                placeholder={t("form.designationPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-quote">{t("form.quoteLabel")}</Label>
              <Textarea
                id="share-quote"
                value={form.quote}
                onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                required
                rows={4}
                maxLength={1000}
                placeholder={t("form.quotePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-phone">{t("form.phoneLabel")}</Label>
              <Input
                id="share-phone"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
                placeholder={t("form.phonePlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("form.phoneHint")}</p>
            </div>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <DialogFooter>
              <Button type="submit" disabled={sendingOtp}>
                {sendingOtp ? t("form.sendingCode") : t("form.sendCode")}
              </Button>
            </DialogFooter>
          </form>
        ) : null}

        {step === STEPS.OTP ? (
          <form onSubmit={verifyAndSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("otp.title")}</DialogTitle>
              <DialogDescription>
                {t("otp.description", { phone: form.phone })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="share-otp">{t("otp.codeLabel")}</Label>
              <Input
                id="share-otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                placeholder={t("otp.codePlaceholder")}
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
                {cooldown > 0
                  ? t("otp.resendCooldown", { seconds: cooldown })
                  : t("otp.resend")}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? t("otp.submitting") : t("otp.submit")}
              </Button>
            </DialogFooter>
          </form>
        ) : null}

        {step === STEPS.SUCCESS ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="size-10 text-emerald-500" />
            <DialogHeader>
              <DialogTitle>{t("success.title")}</DialogTitle>
              <DialogDescription>{t("success.description")}</DialogDescription>
            </DialogHeader>
            <Button variant="outline" onClick={() => resetAndClose(false)}>
              {t("success.close")}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

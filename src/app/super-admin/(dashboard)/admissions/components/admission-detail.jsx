"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_META = {
  NEW: { label: "New", variant: "blue" },
  CONTACTED: { label: "Contacted", variant: "warning" },
  CLOSED: { label: "Closed", variant: "outline" },
};

function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{value || <span className="text-muted-foreground">-</span>}</p>
    </div>
  );
}

export function AdmissionDetail({ item }) {
  const router = useRouter();
  const [status, setStatus] = useState(item.status);
  const [updating, setUpdating] = useState(false);

  async function updateStatus(newStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/super-admin/admissions/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      setStatus(data.item.status);
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  }

  const statusMeta = STATUS_META[status] ?? STATUS_META.NEW;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
        <div className="flex gap-2">
          {status !== "NEW" ? (
            <Button variant="outline" size="sm" disabled={updating} onClick={() => updateStatus("NEW")}>
              Mark as new
            </Button>
          ) : null}
          {status !== "CONTACTED" ? (
            <Button variant="outline" size="sm" disabled={updating} onClick={() => updateStatus("CONTACTED")}>
              Mark as contacted
            </Button>
          ) : null}
          {status !== "CLOSED" ? (
            <Button variant="outline" size="sm" disabled={updating} onClick={() => updateStatus("CLOSED")}>
              Mark as closed
            </Button>
          ) : null}
        </div>
      </div>

      <div className="rounded-md border p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Student name" value={item.studentName} />
          <Field
            label="Date of birth"
            value={item.dateOfBirth ? format(new Date(item.dateOfBirth), "MMM d, yyyy") : null}
          />
          <Field label="Gender" value={item.gender} />
          <Field label="Class applying for" value={item.classAppliedFor} />
          <Field label="Parent/guardian name" value={item.parentName} />
          <Field label="Phone" value={item.phone} />
          <Field label="Email" value={item.email} />
          <Field label="Previous school" value={item.previousSchool} />
          <div className="sm:col-span-2">
            <Field label="Address" value={item.address} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Message" value={item.message} />
          </div>
          <Field label="Submitted" value={format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a")} />
        </div>
      </div>
    </div>
  );
}

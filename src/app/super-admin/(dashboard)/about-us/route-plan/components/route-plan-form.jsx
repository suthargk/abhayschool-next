"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RoutePlanForm({ initialItem, canPublish }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [place, setPlace] = useState(initialItem?.place ?? "");
  const [routeNo, setRouteNo] = useState(initialItem?.routeNo ?? "");
  const [distanceKm, setDistanceKm] = useState(initialItem?.distanceKm ?? "");
  const [rentPerYear, setRentPerYear] = useState(initialItem?.rentPerYear ?? "");
  const [status, setStatus] = useState(initialItem?.status ?? "DRAFT");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      place,
      routeNo,
      rentPerYear,
      distanceKm: distanceKm === "" ? null : distanceKm,
    };

    try {
      const res = await fetch(
        isEdit
          ? `/api/super-admin/bus-routes/${initialItem.id}`
          : "/api/super-admin/bus-routes",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/super-admin/about-us/route-plan");
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
      const res = await fetch(`/api/super-admin/bus-routes/${initialItem.id}/publish`, {
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

      <div className="space-y-2">
        <Label htmlFor="route-plan-place">Place</Label>
        <Input
          id="route-plan-place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          required
          placeholder="e.g. Agawari"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="route-plan-route-no">Route no.</Label>
          <Input
            id="route-plan-route-no"
            type="number"
            min="1"
            step="1"
            value={routeNo}
            onChange={(e) => setRouteNo(e.target.value)}
            required
            placeholder="e.g. 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="route-plan-distance">Distance (km)</Label>
          <Input
            id="route-plan-distance"
            type="number"
            min="0"
            step="0.1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="route-plan-rent">Rent / year (₹)</Label>
          <Input
            id="route-plan-rent"
            type="number"
            min="0"
            step="1"
            value={rentPerYear}
            onChange={(e) => setRentPerYear(e.target.value)}
            required
            placeholder="e.g. 10250"
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
          onClick={() => router.push("/super-admin/about-us/route-plan")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const TEMPLATE_CSV = [
  "Class,Day,Period,Subject,Teacher,Start Time,End Time",
  "Class V,Monday,1,Mathematics,Mrs. Sharma,09:00,09:45",
].join("\n");

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "time-table-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function TimeTableImportDialog({ onImported }) {
  const [open, setOpen] = useState(false);
  const [publish, setPublish] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  function reset() {
    setError("");
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose a file to upload");
      return;
    }

    setImporting(true);
    setError("");
    setResult(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("publish", String(publish));

      const res = await fetch("/api/super-admin/time-table/import", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");

      setResult(data);
      if (data.created + data.updated > 0) {
        await onImported?.();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Upload className="size-4" />
          Import from sheet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import time table</DialogTitle>
          <DialogDescription>
            Upload a .xlsx, .xls, or .csv file with columns Class, Day, Period, Subject,
            and optionally Teacher, Start Time, End Time. Existing slots with the same
            class, day, and period are overwritten.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={downloadTemplate}
          >
            <Download className="size-3.5" />
            Download template
          </Button>

          <div className="space-y-2">
            <Label htmlFor="time-table-import-file">Spreadsheet file</Label>
            <input
              ref={fileInputRef}
              id="time-table-import-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="time-table-import-publish"
              checked={publish}
              onCheckedChange={(checked) => setPublish(Boolean(checked))}
            />
            <Label htmlFor="time-table-import-publish" className="font-normal">
              Publish imported rows immediately
            </Label>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          {result ? (
            <div className="space-y-1 rounded-md border bg-muted/40 p-3 text-sm">
              <p>
                {result.created} created, {result.updated} updated
                {result.skipped ? `, ${result.skipped} skipped` : ""}.
              </p>
              {result.errors?.length ? (
                <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                  {result.errors.map((e, i) => (
                    <li key={i}>
                      Row {e.row}: {e.message}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button type="submit" disabled={importing}>
              {importing ? "Importing…" : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { WEEKDAYS } from "@/data/weekdays";

// WEEKDAYS values from @/data/weekdays -> "academics.timeTable.weekdays" message keys
const WEEKDAY_LABEL_KEYS = {
  MONDAY: "monday",
  TUESDAY: "tuesday",
  WEDNESDAY: "wednesday",
  THURSDAY: "thursday",
  FRIDAY: "friday",
  SATURDAY: "saturday",
};

function classShortLabel(label) {
  return label.replace(/^Class\s+/, "");
}

function chipClasses(active) {
  return cn(
    "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
    active
      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
      : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
  );
}

export function TimeTableView({ slots, classes }) {
  const t = useTranslations("academics.timeTable");
  const classesInUse = useMemo(() => {
    const present = new Set(slots.map((slot) => slot.class));
    return classes.filter((klass) => present.has(klass.value));
  }, [slots, classes]);

  const [selectedClass, setSelectedClass] = useState(
    classesInUse[0]?.value ?? classes[0]?.value
  );

  const classSlots = useMemo(
    () => slots.filter((slot) => slot.class === selectedClass),
    [slots, selectedClass]
  );

  const daysInUse = useMemo(() => {
    const present = new Set(classSlots.map((slot) => slot.day));
    return WEEKDAYS.filter((day) => present.has(day.value));
  }, [classSlots]);

  const periods = useMemo(() => {
    const values = new Set(classSlots.map((slot) => slot.period));
    return Array.from(values).sort((a, b) => a - b);
  }, [classSlots]);

  const slotByDayPeriod = useMemo(() => {
    const map = new Map();
    for (const slot of classSlots) {
      map.set(`${slot.day}-${slot.period}`, slot);
    }
    return map;
  }, [classSlots]);

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const selectedClassLabel =
    classes.find((klass) => klass.value === selectedClass)?.label ?? selectedClass;

  async function handleDownloadPdf() {
    setDownloadingPdf(true);
    try {
      const [{ jsPDF }, { autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(14);
      doc.text(t("schoolName"), 14, 15);
      doc.setFontSize(11);
      doc.text(t("pdfTitle", { className: selectedClassLabel }), 14, 22);

      autoTable(doc, {
        startY: 28,
        head: [[t("periodColumn"), ...daysInUse.map((day) => t(`weekdays.${WEEKDAY_LABEL_KEYS[day.value]}`))]],
        body: periods.map((period) => [
          String(period),
          ...daysInUse.map((day) => {
            const slot = slotByDayPeriod.get(`${day.value}-${period}`);
            if (!slot) return "—";
            const lines = [slot.subject];
            if (slot.teacherName) lines.push(slot.teacherName);
            if (slot.startTime || slot.endTime) {
              lines.push(
                slot.startTime && slot.endTime
                  ? `${slot.startTime} – ${slot.endTime}`
                  : slot.startTime || slot.endTime
              );
            }
            return lines.join("\n");
          }),
        ]),
        styles: { fontSize: 9, cellPadding: 3, valign: "middle" },
        headStyles: { fillColor: [24, 24, 27] },
      });

      const filename = `time-table-${selectedClassLabel.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      doc.save(filename);
    } finally {
      setDownloadingPdf(false);
    }
  }

  if (classesInUse.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        {t("emptyGlobal")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 pb-1">
          {classesInUse.map((klass) => (
            <button
              key={klass.value}
              type="button"
              onClick={() => setSelectedClass(klass.value)}
              title={klass.label}
              className={chipClasses(selectedClass === klass.value)}
            >
              {classShortLabel(klass.label)}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={periods.length === 0 || downloadingPdf}
          onClick={handleDownloadPdf}
          className="shrink-0 gap-1.5"
        >
          <FileDown className="size-4" />
          {downloadingPdf ? t("preparingPdf") : t("downloadPdf")}
        </Button>
      </div>

      {periods.length === 0 ? (
        <p className="rounded-md border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {t("emptyClass")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800">
                <TableHead className="text-zinc-900 dark:text-zinc-50">{t("periodColumn")}</TableHead>
                {daysInUse.map((day) => (
                  <TableHead key={day.value} className="text-zinc-900 dark:text-zinc-50">
                    {t(`weekdays.${WEEKDAY_LABEL_KEYS[day.value]}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period} className="bg-white dark:bg-zinc-900">
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                    {period}
                  </TableCell>
                  {daysInUse.map((day) => {
                    const slot = slotByDayPeriod.get(`${day.value}-${period}`);
                    return (
                      <TableCell key={day.value} className="text-zinc-700 dark:text-zinc-300">
                        {slot ? (
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">
                              {slot.subject}
                            </p>
                            {slot.teacherName ? (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {slot.teacherName}
                              </p>
                            ) : null}
                            {slot.startTime || slot.endTime ? (
                              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                {slot.startTime && slot.endTime
                                  ? `${slot.startTime} – ${slot.endTime}`
                                  : slot.startTime || slot.endTime}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-zinc-300 dark:text-zinc-700">—</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

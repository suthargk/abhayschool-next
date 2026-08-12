"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function YearFilter({ year, years }) {
  const router = useRouter();

  if (years.length === 0) return null;

  return (
    <Select
      value={String(year)}
      onValueChange={(value) =>
        router.push(`/achievements/toppers?year=${value}`)
      }
    >
      <SelectTrigger className="h-9 w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

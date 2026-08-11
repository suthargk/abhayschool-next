"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FacultyFilters({ initialDepartment, departments }) {
  const router = useRouter();

  function handleChange(value) {
    router.push(value === "all" ? "/faculty" : `/faculty?department=${encodeURIComponent(value)}`);
  }

  if (departments.length === 0) return null;

  return (
    <Select value={initialDepartment || "all"} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-56">
        <SelectValue placeholder="All departments" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All departments</SelectItem>
        {departments.map((department) => (
          <SelectItem key={department} value={department}>
            {department}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

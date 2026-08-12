"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "all";

export function FacultyFilters({ initialQuery, initialDepartment, initialGrade, initialSubject, departments, grades, subjects }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery || "");

  function pushParams(next) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === ALL) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`/about/faculty${params.toString() ? `?${params.toString()}` : ""}#directory`);
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      pushParams({ q: query });
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onBlur={() => pushParams({ q: query })}
          placeholder="Search faculty..."
          className="pl-9"
        />
      </div>

      {departments.length > 0 ? (
        <Select value={initialDepartment || ALL} onValueChange={(value) => pushParams({ department: value })}>
          <SelectTrigger className="h-9 w-full sm:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {grades.length > 0 ? (
        <Select value={initialGrade || ALL} onValueChange={(value) => pushParams({ grade: value })}>
          <SelectTrigger className="h-9 w-full sm:w-40">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Grades</SelectItem>
            {grades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {subjects.length > 0 ? (
        <Select value={initialSubject || ALL} onValueChange={(value) => pushParams({ subject: value })}>
          <SelectTrigger className="h-9 w-full sm:w-48">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}

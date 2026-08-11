"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LIBRARY_CLASSES, libraryClassLabel } from "@/data/library-classes";

export function LibraryCatalog({ books }) {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((book) => {
      if (selectedClass !== "all" && book.class !== selectedClass) return false;
      if (!q) return true;
      return (
        book.bookName.toLowerCase().includes(q) ||
        book.subject.toLowerCase().includes(q) ||
        book.publication.toLowerCase().includes(q)
      );
    });
  }, [books, search, selectedClass]);

  const showClassColumn = selectedClass === "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book name, subject, or publication..."
            className="border-zinc-200 bg-white pl-8 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="border-zinc-200 bg-white sm:w-56 dark:border-zinc-800 dark:bg-zinc-900">
            <SelectValue placeholder="All classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {LIBRARY_CLASSES.map((klass) => (
              <SelectItem key={klass.value} value={klass.value}>
                {klass.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800">
              {showClassColumn ? (
                <TableHead className="text-zinc-900 dark:text-zinc-50">Class</TableHead>
              ) : null}
              <TableHead className="text-zinc-900 dark:text-zinc-50">Book Name</TableHead>
              <TableHead className="text-zinc-900 dark:text-zinc-50">Subject</TableHead>
              <TableHead className="text-zinc-900 dark:text-zinc-50">Publications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((book) => (
                <TableRow key={book.id} className="bg-white dark:bg-zinc-900">
                  {showClassColumn ? (
                    <TableCell className="text-zinc-700 dark:text-zinc-300">
                      {libraryClassLabel(book.class)}
                    </TableCell>
                  ) : null}
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                    {book.bookName}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {book.subject}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {book.publication}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={showClassColumn ? 4 : 3}
                  className="h-24 text-center text-zinc-500 dark:text-zinc-400"
                >
                  {search
                    ? "No books match your search."
                    : "No books listed for this class yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

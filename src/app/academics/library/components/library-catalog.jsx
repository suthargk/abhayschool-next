"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { classLabel } from "@/lib/classes";

const PAGE_SIZE = 20;

const SORT_COLUMNS = [
  { key: "class", label: "Class" },
  { key: "bookName", label: "Book Name" },
  { key: "subject", label: "Subject" },
  { key: "publication", label: "Publications" },
];

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

export function LibraryCatalog({ books, classes }) {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedPublication, setSelectedPublication] = useState("all");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  const classesInUse = useMemo(() => {
    const present = new Set(books.map((book) => book.class));
    return classes.filter((klass) => present.has(klass.value));
  }, [books, classes]);

  const subjects = useMemo(
    () =>
      Array.from(new Set(books.map((book) => book.subject))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [books]
  );
  const publications = useMemo(
    () =>
      Array.from(new Set(books.map((book) => book.publication))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [books]
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedClass !== "all" ||
    selectedSubject !== "all" ||
    selectedPublication !== "all";

  function resetToFirstPage(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  const setSearchAndReset = resetToFirstPage(setSearch);
  const setClassAndReset = resetToFirstPage(setSelectedClass);
  const setSubjectAndReset = resetToFirstPage(setSelectedSubject);
  const setPublicationAndReset = resetToFirstPage(setSelectedPublication);

  function clearFilters() {
    setSearch("");
    setSelectedClass("all");
    setSelectedSubject("all");
    setSelectedPublication("all");
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((book) => {
      if (selectedClass !== "all" && book.class !== selectedClass) return false;
      if (selectedSubject !== "all" && book.subject !== selectedSubject)
        return false;
      if (
        selectedPublication !== "all" &&
        book.publication !== selectedPublication
      )
        return false;
      if (!q) return true;
      return (
        book.bookName.toLowerCase().includes(q) ||
        book.subject.toLowerCase().includes(q) ||
        book.publication.toLowerCase().includes(q) ||
        classLabel(classes, book.class).toLowerCase().includes(q)
      );
    });
  }, [books, search, selectedClass, selectedSubject, selectedPublication]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    const valueOf = (book) =>
      sort.key === "class" ? classLabel(classes, book.class) : book[sort.key];
    return [...filtered].sort(
      (a, b) => valueOf(a).localeCompare(valueOf(b)) * dir
    );
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () =>
      sorted.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [sorted, currentPage]
  );

  const rangeStart = sorted.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, sorted.length);

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: "asc" };
    });
  }

  function SortIcon({ column }) {
    if (sort.key !== column)
      return <ArrowUpDown className="size-3.5 text-zinc-400" />;
    return sort.dir === "asc" ? (
      <ArrowUp className="size-3.5" />
    ) : (
      <ArrowDown className="size-3.5" />
    );
  }

  const emptyMessage = hasActiveFilters
    ? "No books match your search or filters."
    : "No books listed yet.";

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearchAndReset(e.target.value)}
          placeholder="Search by book name, subject, publication, or class..."
          className="h-11 border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-zinc-900"
        />
      </div>

      {classesInUse.length > 0 ? (
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <button
            type="button"
            onClick={() => setClassAndReset("all")}
            className={chipClasses(selectedClass === "all")}
          >
            All Classes
          </button>
          {classesInUse.map((klass) => (
            <button
              key={klass.value}
              type="button"
              onClick={() => setClassAndReset(klass.value)}
              title={klass.label}
              className={chipClasses(selectedClass === klass.value)}
            >
              {classShortLabel(klass.label)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedSubject} onValueChange={setSubjectAndReset}>
          <SelectTrigger className="w-full border-zinc-200 bg-white sm:w-48 dark:border-zinc-800 dark:bg-zinc-900">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedPublication}
          onValueChange={setPublicationAndReset}
        >
          <SelectTrigger className="w-full border-zinc-200 bg-white sm:w-48 dark:border-zinc-800 dark:bg-zinc-900">
            <SelectValue placeholder="All publications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All publications</SelectItem>
            {publications.map((publication) => (
              <SelectItem key={publication} value={publication}>
                {publication}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-zinc-500 dark:text-zinc-400"
          >
            <X className="size-3.5" />
            Clear filters
          </Button>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        {sorted.length === 0
          ? "No books found."
          : `Showing ${rangeStart}–${rangeEnd} of ${sorted.length} ${
              sorted.length === 1 ? "book" : "books"
            }`}
      </p>

      <div className="hidden overflow-hidden rounded-md border border-zinc-200 md:block dark:border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800">
              {SORT_COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-zinc-900 dark:text-zinc-50"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {col.label}
                    <SortIcon column={col.key} />
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((book) => (
                <TableRow key={book.id} className="bg-white dark:bg-zinc-900">
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {classLabel(classes, book.class)}
                  </TableCell>
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
                  colSpan={4}
                  className="h-24 text-center text-zinc-500 dark:text-zinc-400"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {paginated.length > 0 ? (
          paginated.map((book) => (
            <div
              key={book.id}
              className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {book.bookName}
              </p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500 dark:text-zinc-400">Class</dt>
                  <dd className="text-right text-zinc-700 dark:text-zinc-300">
                    {classLabel(classes, book.class)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    Subject
                  </dt>
                  <dd className="text-right text-zinc-700 dark:text-zinc-300">
                    {book.subject}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    Publication
                  </dt>
                  <dd className="text-right text-zinc-700 dark:text-zinc-300">
                    {book.publication}
                  </dd>
                </div>
              </dl>
            </div>
          ))
        ) : (
          <p className="rounded-md border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {emptyMessage}
          </p>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1"
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="gap-1"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

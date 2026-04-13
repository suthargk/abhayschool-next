"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { id: "class_ix", label: "Class IX" },
  { id: "class_x", label: "Class X" },
  { id: "class_xi", label: "Class XI" },
];

const booksByTab = {
  class_ix: [
    {
      bookName: "Beehive — English Textbook",
      subject: "English",
      publication: "NCERT",
    },
    {
      bookName: "Moments — Supplementary Reader",
      subject: "English",
      publication: "NCERT",
    },
    {
      bookName: "Mathematics",
      subject: "Mathematics",
      publication: "NCERT",
    },
    {
      bookName: "Science",
      subject: "Science",
      publication: "NCERT",
    },
    {
      bookName: "India and the Contemporary World — I",
      subject: "Social Science",
      publication: "NCERT",
    },
  ],
  class_x: [
    {
      bookName: "First Flight — English Textbook",
      subject: "English",
      publication: "NCERT",
    },
    {
      bookName: "Footprints Without Feet",
      subject: "English",
      publication: "NCERT",
    },
    {
      bookName: "Mathematics",
      subject: "Mathematics",
      publication: "NCERT",
    },
    {
      bookName: "Science",
      subject: "Science",
      publication: "NCERT",
    },
    {
      bookName: "Understanding Economic Development",
      subject: "Social Science",
      publication: "NCERT",
    },
  ],
  class_xi: [
    {
      bookName: "Hornbill — Core Course",
      subject: "English",
      publication: "NCERT",
    },
    {
      bookName: "Snapshots — Supplementary Reader",
      subject: "English",
      publication: "NCERT",
    },
    {
      bookName: "Physics Part 1 & 2",
      subject: "Physics",
      publication: "NCERT",
    },
    {
      bookName: "Chemistry Part 1 & 2",
      subject: "Chemistry",
      publication: "NCERT",
    },
    {
      bookName: "Biology",
      subject: "Biology",
      publication: "NCERT",
    },
    {
      bookName: "Mathematics",
      subject: "Mathematics",
      publication: "NCERT",
    },
  ],
};

function BooksTable({ tabId, rows }) {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800">
            <TableHead className="text-zinc-900 dark:text-zinc-50">
              Book Name
            </TableHead>
            <TableHead className="text-zinc-900 dark:text-zinc-50">
              Subject
            </TableHead>
            <TableHead className="text-zinc-900 dark:text-zinc-50">
              Publications
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <TableRow
                key={`${tabId}-${index}`}
                className="bg-white dark:bg-zinc-900"
              >
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                  {row.bookName}
                </TableCell>
                <TableCell className="text-zinc-700 dark:text-zinc-300">
                  {row.subject}
                </TableCell>
                <TableCell className="text-zinc-700 dark:text-zinc-300">
                  {row.publication}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-zinc-500 dark:text-zinc-400"
              >
                No books listed for this section yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const LibraryPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">
            Library
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Browse recommended titles by class. Columns list book name, subject,
            and publication.
          </p>
        </div>

        <Tabs defaultValue={tabs[0].id} className="w-full">
          <TabsList
            aria-label="Library catalogue by class"
            className="h-auto w-full flex-wrap justify-start gap-1 bg-zinc-100 p-1 dark:bg-zinc-800 md:w-auto"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-zinc-50"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="pt-6">
              <BooksTable tabId={tab.id} rows={booksByTab[tab.id] ?? []} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default LibraryPage;

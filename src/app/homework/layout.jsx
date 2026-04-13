"use client";

import Select from "@/components/select";
import { Calendar } from "@/components/ui/calendar";

import React, { useState } from "react";
export const classrooms = [
  {
    value: "class_12",
    label: "Class 12",
  },
  {
    value: "class_11",
    label: "Class 11",
  },
  {
    value: "class_10",
    label: "Class 10",
  },
  {
    value: "class_9",
    label: "Class 9",
  },
  {
    value: "class_8",
    label: "Class 8",
  },
  {
    value: "class_7",
    label: "Class 7",
  },
  {
    value: "class_6",
    label: "Class 6",
  },
  {
    value: "class_5",
    label: "Class 5",
  },
  {
    value: "class_4",
    label: "Class 4",
  },
  {
    value: "class_3",
    label: "Class 3",
  },
  {
    value: "class_2",
    label: "Class 2",
  },
  {
    value: "class_1",
    label: "Class 1",
  },
];

export const subjects = [
  {
    value: "english",
    label: "English",
  },
  {
    value: "hindi",
    label: "Hindi",
  },
  {
    value: "mathematics",
    label: "Mathematics",
  },
  {
    value: "physics",
    label: "Physics",
  },
];

const HomeworkLayout = ({ children }) => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="w-full">
      <div className="hidden md:block w-[270px] fixed z-10 border-r h-full p-2">
        <div className="border-b -mx-2 h-10 px-3">
          <h1 className="font-semibold text-zinc-100 text-lg">Homework</h1>
        </div>
        <h2 className="p-2 text-sm text-zinc-400 my-2">Filter</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(dateValue) => {
            setDate(dateValue);
          }}
          className="rounded-md border"
        />
        <div className="mt-2 w-full">
          <Select list={classrooms} title="Classroom" />
        </div>
        <div className="mt-2 w-full">
          <Select list={subjects} title="Subject" />
        </div>
      </div>

      {children}
    </div>
  );
};

export default HomeworkLayout;

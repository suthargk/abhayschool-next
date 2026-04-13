import React from "react";
import { columns } from "./components/custom-table/columns";
import CustomTable from "./components/custom-table";

const created_at = new Date();
const date = created_at.getDate();
const month = created_at.getMonth();
const year = created_at.getFullYear();

const data = [
  {
    id: 1,
    title:
      "Thank you for reaching out. I am available at any time for a phone interview",
    created_at: `${date}/${month}/${year}`,
    subject: "English",
  },
  {
    id: 2,
    title:
      "Please let me know a time that works best for you, and I will ensure I am available.",
    created_at: `${date}/${month}/${year}`,
    subject: "Hindi",
  },
  {
    id: 3,
    title:
      "You are the finest, loveliest, tenderest, and most beautiful person I have ever known—and even that is an understatement",
    created_at: `${date}/${month}/${year}`,
    subject: "Physics",
  },
  {
    id: 4,
    title:
      "All the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
    created_at: `${date}/${month}/${year}`,
    subject: "Mathematics",
  },
  {
    id: 5,
    title:
      "You have bewitched me, body and soul, and I love, I love, I love you.",
    created_at: `${date}/${month}/${year}`,
    subject: "English",
  },
  {
    id: 6,
    title: "Every moment spent with you is like a beautiful dream come true.",
    created_at: `${date}/${month}/${year}`,
    subject: "Hindi",
  },
];

const HomeworkPage = () => {
  return (
    <div className="m-0 p-4 pt-[100px] md:p-10 lg:p-20 lg:pt-[102px] md:pt-[102px] md:ml-[270px] bg-zinc-50 dark:bg-zinc-900">
      <CustomTable data={data} columns={columns} />
    </div>
  );
};

export default HomeworkPage;

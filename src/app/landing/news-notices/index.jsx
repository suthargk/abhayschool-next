import React from "react";
import webpImage from "../../../../public/peppa_news.png";
import Link from "next/link";
import Image from "next/image";

const data = [
  {
    id: 1,
    title: "Getting Started with UI design",
    description: "Design your first iOS app using the best pratices...",
    updated_at: "a while ago",
  },
  {
    id: 2,
    title: "Getting Started with UI design",
    description: "Design your first iOS app using the best pratices...",
    updated_at: "2024-09-04",
  },
  {
    id: 3,
    title: "Getting Started with UI design",
    description: "Design your first iOS app using the best pratices...",
    updated_at: "2024-11-24",
  },
  {
    id: 4,
    title: "Getting Started with UI design",
    description: "Design your first iOS app using the best pratices...",
    updated_at: "2023-01-20",
  },
];

const NewsNotices = () => {
  return (
    <section className="flex flex-col items-center">
      <div>
        <h4 className="text-3xl font-semibold mb-2">
          <span>School Updates and Announcements</span>
        </h4>
        <div className="text-zinc-700 text-center dark:text-zinc-500">
          Stay Informed with the Latest News and Important Notices
        </div>
      </div>

      <div className="border rounded-xl p-3 w-[700px] mt-10">
        <div className="flex gap-4 ">
          <div className="flex flex-col gap-4 items-center bg-gradient-to-b from-violet-500 to-violet-700 w-1/4 rounded-md p-2">
            <Image
              src={webpImage}
              width={120}
              height={120}
              alt="news-image"
              className="mt-4"
              draggable={false}
            />
            <div>
              <h3 className="font-semibold text-xl text-center text-white">
                Getting Started with UI design
              </h3>
            </div>
          </div>
          <div className="rounded-md w-3/4 p-2">
            <div className="uppercase text-sm font-medium text-zinc-600 dark:text-zinc-500">
              News and Notices
            </div>
            <div className="flex flex-col mt-4">
              {data.map((item) => {
                return (
                  <Link
                    href="#"
                    key={item.id}
                    className="group flex flex-col gap-6 dark:hover:bg-zinc-800 hover:bg-violet-100 duration-200 border border-transparent hover:border-violet-200 dark:hover:border-zinc-700 p-2 rounded-md"
                  >
                    <div className="flex gap-4 ">
                      <div className="group-hover:bg-violet-200 dark:group-hover:bg-zinc-700 duration-200 p-2 text-zinc-800 h-10 w-10 flex justify-center items-center rounded-full text-lg bg-violet-100 dark:bg-zinc-800 dark:text-zinc-100">
                        {item.id}
                      </div>
                      <div className="">
                        <div className="flex justify-between">
                          <h2 className="dark:text-zinc-50">{item.title}</h2>
                          <div className="w-28 text-sm rounded-md px-2.5 flex justify-center items-center bg-violet-100 group-hover:bg-violet-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                            {item.updated_at}
                          </div>
                        </div>
                        <div className="text-zinc-800 font-light dark:text-zinc-500">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsNotices;

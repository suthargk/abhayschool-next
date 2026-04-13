"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LANGUAGES } from "@/Helper/languages";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import webpImage from "../../../../public/peppa.webp";
import Image from "next/image";

const Footer = () => {
  const { theme, setTheme } = useTheme();
  return (
    <footer className="bg-violet-600 py-10 px-5 mt-10">
      <div className="flex justify-center">
        <div className="mr-10">
          <Image
            draggable={false}
            className="-mt-6"
            src={webpImage}
            height={130}
            width={130}
          />
        </div>
        <div className="grid grid-cols-4 gap-10">
          <div>
            <h3 className="text-violet-200 font-semibold mb-3">School</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="#">About Us</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">Faculty</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">Facilities</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">Principal's Message</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#"> Route Plan of School Buses</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-violet-200 font-semibold mb-3">For students</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="#">Blog</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">Homework</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">News & Notices</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-violet-200 font-semibold mb-3">Achievements</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="#">Achievements</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">Toppers</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-violet-200 font-semibold mb-3">Utilities</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="#">Gallery</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">Contact Us</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">How to Reach Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <Select>
            <SelectTrigger className="w-48 text-white border-none bg-violet-500 focus:ring-violet-400 rounded-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                {LANGUAGES.map((language) => {
                  return (
                    <SelectItem key={language.id} value={language}>
                      {language.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <ToggleGroup
            type="single"
            className="justify-start rounded-full border bg-violet-500 border-violet-400 w-fit p-0.5 self-end"
            defaultValue={theme}
            onValueChange={(value) => {
              setTheme(value);
            }}
          >
            <ToggleGroupItem
              value="system"
              aria-label="Toggle system"
              className="rounded-full text-white h-8 min-w-8"
            >
              <DesktopIcon
                width={10}
                height={10}
                style={{ width: "16px", height: "16px" }}
              />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="light"
              aria-label="Toggle light"
              className="rounded-full text-white h-8 min-w-8"
            >
              <SunIcon
                width={10}
                height={10}
                style={{ width: "16px", height: "16px" }}
              />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="dark"
              aria-label="Toggle dark"
              className="rounded-full text-white h-8 min-w-8"
            >
              <MoonIcon style={{ width: "16px", height: "16px" }} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-5 px-24">
        <div className="h-[0.5px] w-full bg-violet-400"></div>
        <div className="flex justify-between text-xs self-start text-violet-200 w-full">
          <p className="">&copy; Shri Abhay Nobles Senior Secondary School</p>
          <p>
            Peppa Pig Theme by{" "}
            <Link
              href="https://www.twitter.com/suthargk"
              target="_blank"
              className="font-bold"
            >
              Gaurav Suthar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

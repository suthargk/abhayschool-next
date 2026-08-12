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
    <footer className="bg-violet-600 py-10 px-5 sm:px-8 lg:px-16 mt-10">
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-0">
        <div className="lg:mr-10">
          <Image
            draggable={false}
            className="lg:-mt-6"
            src={webpImage}
            height={130}
            width={130}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 sm:gap-10 text-left w-full sm:w-auto">
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
                <Link href="/about/facilities">Facilities</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="/about/principal-message">
                  Principal&apos;s Message
                </Link>
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
                <Link href="/news-notices">News & Notices</Link>
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
                <Link href="/achievements/toppers">Toppers</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-violet-200 font-semibold mb-3">Utilities</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="/gallery">Gallery</Link>
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

        <div className="flex flex-col items-center lg:items-end justify-between gap-4 lg:gap-0">
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
            className="justify-start rounded-full border bg-violet-500 border-violet-400 w-fit p-0.5 lg:self-end"
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

      <div className="mt-10 flex flex-col items-center gap-5 px-0 sm:px-10 lg:px-24">
        <div className="h-[0.5px] w-full bg-violet-400"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2 text-xs text-center sm:text-left self-start text-violet-200 w-full">
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

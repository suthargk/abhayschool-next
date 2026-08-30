"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LanguageSelect } from "@/components/language-select";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import webpImage from "../../../../public/peppa.webp";
import Image from "next/image";

const Footer = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common");
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
            <h3 className="text-violet-200 font-semibold mb-3">{t("footer.schoolHeading")}</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="#">{t("footer.aboutUs")}</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">{t("footer.faculty")}</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="/about/facilities">{t("footer.facilities")}</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="/about/principal-message">
                  {t("footer.principalMessage")}
                </Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#"> {t("footer.busRoutePlan")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-violet-200 font-semibold mb-3">{t("footer.studentsHeading")}</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="#">{t("footer.blog")}</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="/homework">{t("footer.homework")}</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="/news-notices">{t("footer.newsNotices")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-violet-200 font-semibold mb-3">{t("footer.achievementsHeading")}</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="#">{t("footer.achievements")}</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="/achievements/toppers">{t("footer.toppers")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-violet-200 font-semibold mb-3">{t("footer.utilitiesHeading")}</h3>
            <ul className="space-y-3">
              <li className="text-sm text-zinc-50">
                <Link href="/gallery">{t("footer.gallery")}</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">{t("footer.contactUs")}</Link>
              </li>
              <li className="text-sm text-zinc-50">
                <Link href="#">{t("footer.howToReachUs")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end justify-between gap-4 lg:gap-0">
          <LanguageSelect triggerClassName="w-48 text-white border-none bg-violet-500 focus:ring-violet-400 rounded-full" />

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
            {t("footer.themeBy")}{" "}
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

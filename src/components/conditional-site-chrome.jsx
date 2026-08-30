"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/navbar/mobile-nav";
import { Button } from "@/components/ui/button";
import CustomizeSettingDialog from "@/components/customize-setting-dialog";
import { FestivalBackground } from "@/components/backgrounds/festival-background";
import Footer from "@/app/landing/footer";

export function ConditionalSiteChrome({ children }) {
  const pathname = usePathname();
  const t = useTranslations("common");
  const hideSiteChrome =
    pathname?.startsWith("/super-admin") || pathname?.startsWith("/teacher");

  if (hideSiteChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <FestivalBackground />
      <div className="fixed z-50 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-zinc-200 bg-white/80 p-2 px-4 backdrop-blur-lg backdrop-saturate-100 dark:border-zinc-800 dark:bg-zinc-950/80 sm:px-8 md:border-b-0 md:bg-transparent md:backdrop-blur-none md:dark:bg-transparent">
        <Link href="/" className="col-start-1 flex items-center">
          <Image
            src="/images/logo.png"
            alt="Shri Abhay Nobles Senior Secondary School"
            width={44}
            height={44}
            priority
            className="h-10 w-10 sm:h-11 sm:w-11"
          />
        </Link>
        <Navbar />
        <div className="col-start-3 flex items-center justify-end gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden md:inline-flex"
          >
            <Link href="/teacher/login">{t("header.teacherLogin")}</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/#admissions">{t("header.applyNow")}</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
      {children}
      <Footer />
      <CustomizeSettingDialog />
    </>
  );
}

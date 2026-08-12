"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";
import CustomizeSettingDialog from "@/components/customize-setting-dialog";
import Footer from "@/app/landing/footer";

export function ConditionalSiteChrome({ children }) {
  const pathname = usePathname();
  const hideSiteChrome = pathname?.startsWith("/super-admin");

  if (hideSiteChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="fixed z-50 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 p-2 px-4 sm:px-8">
        <Link href="/" className="flex items-center">
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
        <span aria-hidden="true" />
      </div>
      {children}
      <Footer />
      <CustomizeSettingDialog />
    </>
  );
}

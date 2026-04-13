"use client";

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
      <div className="fixed z-50 flex w-full justify-center space-x-2 p-2">
        <Navbar />
      </div>
      {children}
      <Footer />
      <CustomizeSettingDialog />
    </>
  );
}

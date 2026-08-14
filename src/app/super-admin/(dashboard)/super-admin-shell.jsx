"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Bus,
  Building2,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  Library,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareQuote,
  Newspaper,
  Trophy,
  Users,
} from "lucide-react";

const navSections = [
  {
    title: "About us",
    items: [
      {
        href: "/super-admin/principal-message",
        label: "Principal's Message",
        icon: MessageSquareQuote,
      },
      { href: "/super-admin/about-us/faculty", label: "Faculty", icon: Users },
      { href: "/super-admin/about-us/facilities", label: "Facilities", icon: Building2 },
      {
        href: "/super-admin/about-us/route-plan",
        label: "Route plan of school buses",
        icon: Bus,
      },
    ],
  },
  {
    title: null,
    items: [
      { href: "/super-admin/gallery", label: "Gallery", icon: ImageIcon },
      {
        href: "/super-admin/news-notices",
        label: "News & Notices",
        icon: Megaphone,
      },
      {
        href: "/super-admin/homework",
        label: "Homework",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Academic",
    items: [
      { href: "/super-admin/academic/library", label: "Library", icon: Library },
      { href: "/super-admin/academic/blog", label: "Blog", icon: Newspaper },
    ],
  },
  {
    title: "Achievements",
    items: [
      {
        href: "/super-admin/achievements/toppers",
        label: "Toppers",
        icon: Trophy,
      },
    ],
  },
];

function NavLink({ href, label, icon: Icon }) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/super-admin" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function SidebarContent({ onLogout, onNavigate, inSheet }) {
  return (
    <>
      <div
        className={cn(
          "flex h-14 items-center justify-between gap-2 border-b pl-4",
          inSheet ? "pr-12" : "pr-4"
        )}
      >
        <Link
          href="/super-admin"
          className="flex items-center gap-2 text-sm font-semibold"
          onClick={onNavigate}
        >
          <LayoutDashboard className="size-4" />
          Super admin
        </Link>
        <ModeToggle />
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        <div onClick={onNavigate}>
          <NavLink href="/super-admin" label="Dashboard" icon={LayoutDashboard} />
        </div>
        {navSections.map((section) => (
          <div key={section.title ?? section.items[0].href} className="space-y-1">
            {section.title ? (
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
            ) : null}
            <div className="space-y-0.5" onClick={onNavigate}>
              {section.items.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t p-3">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </>
  );
}

export function SuperAdminShell({ children }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/super-admin/logout", { method: "POST" });
    router.replace("/super-admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Toaster richColors theme={resolvedTheme} position="top-right" />
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <SidebarContent onLogout={handleLogout} />
      </aside>
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="flex w-64 max-w-[80vw] flex-col gap-0 p-0"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent
            onLogout={handleLogout}
            onNavigate={() => setMobileNavOpen(false)}
            inSheet
          />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-2 border-b px-4 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
          <p className="truncate text-sm text-muted-foreground">
            School administration dashboard
          </p>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

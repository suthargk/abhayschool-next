"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bus,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  Library,
  LogOut,
  Trophy,
  Users,
} from "lucide-react";

const navSections = [
  {
    title: "About us",
    items: [
      { href: "/super-admin/about-us/faculty", label: "Faculty", icon: Users },
      {
        href: "/super-admin/about-us/route-plan",
        label: "Route plan of school buses",
        icon: Bus,
      },
    ],
  },
  {
    title: null,
    items: [{ href: "/super-admin/gallery", label: "Gallery", icon: ImageIcon }],
  },
  {
    title: "Academic",
    items: [
      { href: "/super-admin/academic/library", label: "Library", icon: Library },
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
      {
        href: "/super-admin/achievements/homework",
        label: "Homework",
        icon: GraduationCap,
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

export function SuperAdminShell({ children }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/super-admin/logout", { method: "POST" });
    router.replace("/super-admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-64 shrink-0 flex-col border-r bg-card">
        <div className="flex h-14 items-center justify-between gap-2 border-b px-4">
          <Link
            href="/super-admin"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <LayoutDashboard className="size-4" />
            Super admin
          </Link>
          <ModeToggle />
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          <div>
            <NavLink href="/super-admin" label="Dashboard" icon={LayoutDashboard} />
          </div>
          {navSections.map((section) => (
            <div key={section.title ?? section.items[0].href} className="space-y-1">
              {section.title ? (
                <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </p>
              ) : null}
              <div className="space-y-0.5">
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
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-6">
          <p className="text-sm text-muted-foreground">
            School administration dashboard
          </p>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

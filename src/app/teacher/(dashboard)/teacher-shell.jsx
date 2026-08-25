"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { ExternalLink, GraduationCap, LayoutDashboard, LogOut } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getInitials, teacherFullName } from "@/lib/teacher";

const navItems = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/homework", label: "Homework", icon: GraduationCap },
];

function getPageTitle(pathname) {
  const match = [...navItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`));
  return match?.label ?? "Dashboard";
}

function NavLink({ href, label, icon: Icon }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/teacher" && pathname?.startsWith(href));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={label}>
        <Link href={href}>
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function TeacherShell({ children, profile }) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const name = teacherFullName(profile);

  async function handleLogout() {
    await fetch("/api/teacher/logout", { method: "POST" });
    router.replace("/teacher/login");
    router.refresh();
  }

  return (
    <SidebarProvider>
      <Toaster richColors theme={resolvedTheme} position="top-right" />
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/teacher">
                  <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Image
                      src="/images/logo.png"
                      alt=""
                      width={32}
                      height={32}
                      className="size-6 object-contain"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Abhay Nobles</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">Teacher</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8 rounded-lg">
                      {profile?.photoUrl ? <AvatarImage src={profile.photoUrl} alt="" /> : null}
                      <AvatarFallback className="rounded-lg">
                        {getInitials(profile?.firstName, profile?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{name || "Teacher"}</span>
                      <span className="truncate text-xs text-sidebar-foreground/70">
                        {profile?.email ?? "Signed in"}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" sideOffset={8} className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4" />
                      View public site
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="h-dvh overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="truncate text-sm font-medium">{getPageTitle(pathname)}</h1>
          <div className="ml-auto flex items-center gap-1">
            <ModeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

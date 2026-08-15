"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Bus,
  Building2,
  ChevronsUpDown,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  Library,
  LogOut,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  Quote,
  Trophy,
  Users,
} from "lucide-react";

const DASHBOARD_ITEM = { href: "/super-admin", label: "Dashboard", icon: LayoutDashboard };
const ADMISSIONS_HREF = "/super-admin/admissions";

const navSections = [
  {
    title: null,
    items: [{ href: ADMISSIONS_HREF, label: "Admissions", icon: ClipboardList }],
  },
  {
    title: "Homepage",
    items: [
      { href: "/super-admin/homepage/faq", label: "FAQ", icon: HelpCircle },
      {
        href: "/super-admin/homepage/testimonials",
        label: "Testimonials",
        icon: Quote,
      },
    ],
  },
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

const ALL_NAV_ITEMS = [
  DASHBOARD_ITEM,
  ...navSections.flatMap((section) => section.items),
].sort((a, b) => b.href.length - a.href.length);

function getPageTitle(pathname) {
  const match = ALL_NAV_ITEMS.find(
    (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)
  );
  return match?.label ?? "Dashboard";
}

function getInitials(email) {
  if (!email) return "SA";
  return email.slice(0, 2).toUpperCase();
}

function NavLink({ href, label, icon: Icon, badge }) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/super-admin" && pathname?.startsWith(href));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={label}>
        <Link href={href}>
          <Icon />
          <span>{label}</span>
          {badge ? (
            <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {badge > 99 ? "99+" : badge}
            </span>
          ) : null}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function SuperAdminShell({ children, profile, newAdmissionsCount = 0 }) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  async function handleLogout() {
    await fetch("/api/super-admin/logout", { method: "POST" });
    router.replace("/super-admin/login");
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
                <Link href="/super-admin">
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
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      Super admin
                    </span>
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
                <NavLink {...DASHBOARD_ITEM} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {navSections.map((section) => (
            <SidebarGroup key={section.title ?? section.items[0].href}>
              {section.title ? (
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.href}
                      {...item}
                      badge={item.href === ADMISSIONS_HREF ? newAdmissionsCount : undefined}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
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
                      <AvatarFallback className="rounded-lg">
                        {getInitials(profile?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {profile?.role === "ADMIN" ? "Admin" : "Editor"}
                      </span>
                      <span className="truncate text-xs text-sidebar-foreground/70">
                        {profile?.email ?? "Signed in"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="end"
                  sideOffset={8}
                  className="w-56"
                >
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
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="View public site"
            >
              <ExternalLink className="size-4" />
            </Link>
            <ModeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { Toaster } from "sonner";

import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSelect } from "@/components/language-select";
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
  Bell,
  Bus,
  Building2,
  CalendarClock,
  ChevronsUpDown,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  ImageIcon,
  Layers,
  LayoutDashboard,
  Library,
  LogOut,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  Quote,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

const DASHBOARD_ITEM = { href: "/super-admin", labelKey: "dashboard", icon: LayoutDashboard };
const ADMISSIONS_HREF = "/super-admin/admissions";
const TESTIMONIALS_HREF = "/super-admin/homepage/testimonials";
const TEACHERS_HREF = "/super-admin/teachers";

// items use `featureKey` when the label is shared with the teacher sidebar
// (translated via "common.teacherFeatures"), or `labelKey` for super-admin-only
// items (translated via "superAdminShell").
const navSections = [
  {
    titleKey: null,
    items: [{ href: ADMISSIONS_HREF, labelKey: "admissions", icon: ClipboardList }],
  },
  {
    titleKey: "sectionHomepage",
    items: [
      { href: "/super-admin/homepage/faq", featureKey: "FAQ", icon: HelpCircle },
      {
        href: "/super-admin/homepage/testimonials",
        featureKey: "TESTIMONIALS",
        icon: Quote,
      },
    ],
  },
  {
    titleKey: "sectionAboutUs",
    items: [
      {
        href: "/super-admin/principal-message",
        featureKey: "PRINCIPAL_MESSAGE",
        icon: MessageSquareQuote,
      },
      { href: "/super-admin/about-us/faculty", featureKey: "FACULTY", icon: Users },
      { href: "/super-admin/about-us/facilities", featureKey: "FACILITIES", icon: Building2 },
      {
        href: "/super-admin/about-us/route-plan",
        labelKey: "busRoutePlan",
        icon: Bus,
      },
    ],
  },
  {
    titleKey: null,
    items: [
      { href: "/super-admin/gallery", featureKey: "GALLERY", icon: ImageIcon },
      {
        href: "/super-admin/news-notices",
        featureKey: "NEWS_NOTICES",
        icon: Megaphone,
      },
      {
        href: "/super-admin/homework",
        labelKey: "homework",
        icon: GraduationCap,
      },
      { href: TEACHERS_HREF, labelKey: "teachers", icon: UserCheck },
    ],
  },
  {
    titleKey: "sectionAcademic",
    items: [
      { href: "/super-admin/classes", featureKey: "CLASSES", icon: Layers },
      { href: "/super-admin/academic/library", featureKey: "LIBRARY", icon: Library },
      {
        href: "/super-admin/academic/time-table",
        featureKey: "TIME_TABLE",
        icon: CalendarClock,
      },
      { href: "/super-admin/academic/blog", featureKey: "BLOG", icon: Newspaper },
    ],
  },
  {
    titleKey: "sectionAchievements",
    items: [
      {
        href: "/super-admin/achievements/toppers",
        featureKey: "TOPPERS",
        icon: Trophy,
      },
    ],
  },
];

function resolveLabel(item, t, tFeatures) {
  return item.featureKey ? tFeatures(item.featureKey) : t(item.labelKey);
}

function getPageTitle(pathname, allNavItems, fallback) {
  const match = allNavItems.find(
    (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)
  );
  return match?.label ?? fallback;
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

const TEACHER_ACTIVITY_ICON = {
  FAQ: HelpCircle,
  Testimonials: Quote,
  "Principal's Message": MessageSquareQuote,
  Faculty: Users,
  Facilities: Building2,
  Gallery: ImageIcon,
  "News & Notices": Megaphone,
  Homework: GraduationCap,
  Classes: Layers,
  Library: Library,
  "Time Table": CalendarClock,
  Blog: Newspaper,
  Toppers: Trophy,
};

function buildNotifications({ pendingAdmissions, pendingTestimonials, teacherActivity }) {
  const admissionNotifications = pendingAdmissions.map((item) => ({
    id: `admission-${item.id}`,
    href: `${ADMISSIONS_HREF}/${item.id}`,
    title: `New admission enquiry from ${item.parentName}`,
    detail: `${item.studentName} · Class ${item.classAppliedFor}`,
    createdAt: item.createdAt,
    icon: null,
  }));
  const testimonialNotifications = pendingTestimonials.map((item) => ({
    id: `testimonial-${item.id}`,
    href: TESTIMONIALS_HREF,
    title: `New testimonial from ${item.name}`,
    detail: item.quote,
    createdAt: item.createdAt,
    icon: null,
  }));
  const teacherNotifications = teacherActivity.map((item) => ({
    id: item.id,
    href: item.href,
    title: `${item.authorName} ${item.action} ${item.kind}`,
    detail: item.detail,
    createdAt: item.createdAt,
    icon: TEACHER_ACTIVITY_ICON[item.kind] ?? null,
  }));

  return [...admissionNotifications, ...testimonialNotifications, ...teacherNotifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function SuperAdminShell({
  children,
  profile,
  newAdmissionsCount = 0,
  pendingAdmissions = [],
  pendingTestimonials = [],
  pendingTeachersCount = 0,
  teacherActivity = [],
}) {
  const router = useRouter();
  const notifications = buildNotifications({
    pendingAdmissions,
    pendingTestimonials,
    teacherActivity,
  });
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const t = useTranslations("superAdminShell");
  const tFeatures = useTranslations("common.teacherFeatures");

  const dashboardItem = { ...DASHBOARD_ITEM, label: t(DASHBOARD_ITEM.labelKey) };
  const resolvedSections = navSections.map((section) => ({
    ...section,
    title: section.titleKey ? t(section.titleKey) : null,
    items: section.items.map((item) => ({ ...item, label: resolveLabel(item, t, tFeatures) })),
  }));
  const allNavItems = [
    dashboardItem,
    ...resolvedSections.flatMap((section) => section.items),
  ].sort((a, b) => b.href.length - a.href.length);

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
                      {t("superAdmin")}
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
                <NavLink {...dashboardItem} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {resolvedSections.map((section) => (
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
                      badge={
                        item.href === ADMISSIONS_HREF
                          ? newAdmissionsCount
                          : item.href === TESTIMONIALS_HREF
                            ? pendingTestimonials.length
                            : item.href === TEACHERS_HREF
                              ? pendingTeachersCount
                              : undefined
                      }
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
                        {profile?.role === "ADMIN" ? t("admin") : t("editor")}
                      </span>
                      <span className="truncate text-xs text-sidebar-foreground/70">
                        {profile?.email ?? t("signedIn")}
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
                      {t("viewPublicSite")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4" />
                    {t("logOut")}
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
          <h1 className="truncate text-sm font-medium">{getPageTitle(pathname, allNavItems, t("dashboard"))}</h1>
          <div className="ml-auto flex items-center gap-1">
            <LanguageSelect triggerClassName="h-8 w-[92px] border-none bg-transparent shadow-none" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={t("notifications")}
                >
                  <Bell className="size-4" />
                  {notifications.length > 0 ? (
                    <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  ) : null}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-80">
                <div className="px-2 py-1.5 text-sm font-medium">{t("notifications")}</div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-muted-foreground">
                    {t("noNewNotifications")}
                  </p>
                ) : (
                  notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.id} asChild className="items-start gap-2">
                        <Link href={item.href}>
                          {Icon ? (
                            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                              <Icon className="size-3.5" />
                            </div>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <span className="block w-full truncate text-sm font-medium">
                              {item.title}
                            </span>
                            <span className="line-clamp-2 w-full text-xs text-muted-foreground">
                              {item.detail}
                            </span>
                            <span className="w-full text-[11px] text-muted-foreground/80">
                              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t("viewPublicSite")}
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

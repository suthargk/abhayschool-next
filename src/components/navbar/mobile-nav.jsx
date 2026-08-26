"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Globe, Menu, Monitor, Moon, Sun } from "lucide-react";

import navigationCategory from "@/Helper/navigation";
import { LANGUAGES } from "@/Helper/languages";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../ui/sheet";

const listVariants = {
  open: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants = {
  closed: { opacity: 0, x: 12 },
  open: { opacity: 1, x: 0 },
};

function getSubHref(category, subCategory, index) {
  if (subCategory.absolute || index === 0) return subCategory.href;
  return category.href + subCategory.href;
}

function NavPill({ href, isActive, children }) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className={cn(
          "block rounded-full px-4 py-3 text-[15px] transition-colors",
          isActive
            ? "bg-violet-100 font-medium text-violet-900 dark:bg-violet-500/15 dark:text-violet-200"
            : "text-foreground/80 hover:bg-muted/60"
        )}
      >
        {children}
      </Link>
    </SheetClose>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [pendingTheme, setPendingTheme] = React.useState(theme);
  const [pendingLanguage, setPendingLanguage] = React.useState(
    LANGUAGES[0].value
  );

  React.useEffect(() => {
    setPendingTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) setPendingLanguage(storedLanguage);
  }, []);

  const links = navigationCategory.filter(
    (category) => !category.subCategories.length
  );
  const sections = navigationCategory.filter(
    (category) => category.subCategories.length
  );

  const handleApplyPreferences = () => {
    localStorage.setItem("language", pendingLanguage);
    setTheme(pendingTheme);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden border-l-0 bg-background p-0 text-foreground sm:max-w-full"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex shrink-0 items-center gap-2.5 px-5 pb-2 pt-5">
          <Image
            src="/images/logo.png"
            alt="Shri Abhay Nobles Senior Secondary School"
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-5 pb-4 pt-2">
          <motion.div
            className="flex flex-col"
            variants={listVariants}
            initial="closed"
            animate="open"
          >
            {links.map((category) => (
              <motion.div key={category.title} variants={itemVariants}>
                <NavPill
                  href={category.href}
                  isActive={pathname === category.href}
                >
                  {category.title}
                </NavPill>
              </motion.div>
            ))}

            {sections.map((category) => (
              <motion.div
                key={category.title}
                variants={itemVariants}
                className="mt-6"
              >
                <div className="mb-1 px-4 text-sm font-semibold text-foreground">
                  {category.title}
                </div>
                {category.subCategories.map((subCategory, index) => {
                  const href = getSubHref(category, subCategory, index);

                  return (
                    <NavPill
                      key={subCategory.title}
                      href={href}
                      isActive={pathname === href}
                    >
                      {subCategory.title}
                    </NavPill>
                  );
                })}
              </motion.div>
            ))}

            <motion.div
              variants={itemVariants}
              className="mt-6 border-t border-border pt-6"
            >
              <div className="mb-1 px-4 text-sm font-semibold text-foreground">
                Preferences
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5">
                <Globe className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <Select
                  value={pendingLanguage}
                  onValueChange={setPendingLanguage}
                >
                  <SelectTrigger className="h-9 flex-1 border-none bg-muted/60 shadow-none">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language.id} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5">
                {pendingTheme === "dark" ? (
                  <Moon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                ) : pendingTheme === "light" ? (
                  <Sun className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                ) : (
                  <Monitor className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                )}
                <ToggleGroup
                  type="single"
                  value={pendingTheme}
                  onValueChange={(value) => value && setPendingTheme(value)}
                  className="flex-1 justify-start gap-2"
                >
                  <ToggleGroupItem
                    value="light"
                    className="flex-1"
                    aria-label="Light mode"
                  >
                    Light
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="dark"
                    className="flex-1"
                    aria-label="Dark mode"
                  >
                    Dark
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="system"
                    className="flex-1"
                    aria-label="System theme"
                  >
                    System
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleApplyPreferences}
                className="mx-4 mt-1 w-[calc(100%-2rem)]"
              >
                Apply
              </Button>
            </motion.div>
          </motion.div>
        </nav>

        <div className="shrink-0 border-t border-border bg-background px-5 py-4">
          <SheetClose asChild>
            <Link
              href="/#admissions"
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Apply Now
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/teacher/login"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "mt-2 w-full"
              )}
            >
              Teacher Login
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

import navigationCategory from "@/Helper/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../ui/sheet";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState(() => new Set());

  const toggleSection = (title) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const links = navigationCategory.filter(
    (category) => !category.subCategories.length
  );
  const sections = navigationCategory.filter(
    (category) => category.subCategories.length
  );

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
        className="flex w-full flex-col overflow-y-auto border-zinc-800 bg-zinc-950 p-0 text-zinc-100 sm:max-w-sm"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-1 flex-col px-5 pb-6 pt-14">
          <SheetClose asChild>
            <Link
              href="/#admissions"
              className={cn(buttonVariants(), "mb-4 w-full")}
            >
              Apply Now
            </Link>
          </SheetClose>

          <div className="flex flex-col">
            {links.map((category) => (
              <SheetClose asChild key={category.title}>
                <Link
                  href={category.href}
                  className="py-3 text-[15px] text-zinc-300 transition-colors hover:text-white"
                >
                  {category.title}
                </Link>
              </SheetClose>
            ))}
          </div>

          <div className="my-3 border-t border-zinc-800" />

          <div className="flex flex-col">
            {sections.map((category) => {
              const isOpen = openSections.has(category.title);
              const Icon = category.icon;

              return (
                <div key={category.title}>
                  <button
                    type="button"
                    onClick={() => toggleSection(category.title)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between py-3 text-left text-[15px] text-zinc-300 transition-colors hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      {Icon ? <Icon className="h-4 w-4 text-zinc-500" /> : null}
                      {category.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-zinc-500 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen ? (
                    <div className="flex flex-col gap-4 pb-4 pl-1">
                      {category.subCategories.map((subCategory, index) => {
                        const href =
                          index === 0
                            ? subCategory.href
                            : category.href + subCategory.href;

                        return (
                          <SheetClose asChild key={subCategory.title}>
                            <Link href={href} className="block">
                              <span className="block text-sm text-zinc-200">
                                {subCategory.title}
                              </span>
                              {subCategory.description ? (
                                <span className="mt-0.5 block text-xs leading-snug text-zinc-500">
                                  {subCategory.description}
                                </span>
                              ) : null}
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

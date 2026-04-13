import * as React from "react";
import Link from "next/link";

import navigationCategory from "@/Helper/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuList,
} from "../ui/navigation-menu";

export function Navbar() {
  return (
    <NavigationMenu className="mx-auto border border-zinc-150 dark:border-zinc-900 rounded-[6px] p-0.5 backdrop-blur-lg backdrop-saturate-100">
      <NavigationMenuList className="">
        {navigationCategory.map((category) => {
          return (
            <NavigationMenuItem key={category.title}>
              {category.subCategories.length ? (
                <>
                  <NavigationMenuTrigger className="font-light text-zinc-500 bg-transparent dark:text-zinc-300 h-auto rounded-[4px]">
                    {category.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      {category.subCategories.map((subCategory, index) => {
                        if (index === 0) {
                          const Icon = category.icon;
                          return (
                            <li
                              key={subCategory.title}
                              className="row-span-4 backdrop-blur-lg backdrop-saturate-100"
                            >
                              <NavigationMenuLink asChild>
                                <Link
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/40 to-muted p-4 no-underline outline-none focus:shadow-md"
                                  href={subCategory.href}
                                >
                                  <Icon className="h-8 w-8" />
                                  <div className="mb-1 mt-3 text-lg font-medium">
                                    {subCategory.title}
                                  </div>
                                  <p className="text-sm leading-tight font-light text-muted-foreground">
                                    {subCategory.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        }

                        return (
                          <ListItem
                            key={subCategory.title}
                            href={category.href + subCategory.href}
                            title={subCategory.title}
                          >
                            {subCategory.description}
                          </ListItem>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    href={category.href}
                    className={`${navigationMenuTriggerStyle()} bg-transparent font-light text-zinc-500 dark:text-zinc-300 h-auto p-1 px-2 rounded-[4px]`}
                  >
                    {category.title}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, href, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href}
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-light leading-none">{title}</div>
            <p className="text-sm leading-snug font-light text-zinc-500">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

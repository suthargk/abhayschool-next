"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  DownloadIcon,
  EyeNoneIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";

export const columns = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
          Title
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[500px] truncate font-medium ">
          {row.getValue("title")}
        </div>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
          Created On
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="w-[100px] font-light">{row.getValue("created_at")}</div>
      );
    },
  },

  {
    accessorKey: "subject",
    header: ({ column }) => {
      return (
        <div className={cn("flex items-center space-x-2")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent text-xs font-medium text-zinc-900 dark:text-zinc-100"
              >
                <span>Subject</span>
                {column.getIsSorted() === "desc" ? (
                  <ArrowDownIcon className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                  <ArrowUpIcon className="ml-2 h-4 w-4" />
                ) : (
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Desc
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" w-[100px] font-light">{row.getValue("subject")}</div>
      );
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
          Action
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" w-[100px] font-light flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <DownloadIcon className="h-4 w-4 rotate-0 transition-all" />
            <span className="sr-only">Download</span>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <EyeOpenIcon className="h-4 w-4 rotate-0 transition-all" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      );
    },
  },
];

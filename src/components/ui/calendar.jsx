"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("en-US", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: "w-fit",
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        month_caption: "flex h-7 w-full items-center justify-center px-7",
        dropdowns: "flex h-7 items-center justify-center gap-1.5 text-sm font-medium",
        dropdown_root:
          "relative rounded-md border border-input has-[:focus]:border-ring has-[:focus]:ring-1 has-[:focus]:ring-ring",
        dropdown: "absolute inset-0 bg-popover opacity-0",
        caption_label:
          captionLayout === "label"
            ? "text-sm font-medium"
            : "flex items-center gap-1 rounded-md px-2 py-1 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground",
        week: "mt-2 flex w-full",
        day: "relative aspect-square size-7 p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
        range_start: "rounded-l-md bg-accent",
        range_middle: "rounded-none bg-accent",
        range_end: "rounded-r-md bg-accent",
        today: "rounded-md bg-accent text-accent-foreground",
        outside: "text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...chevronProps }) => {
          const Icon =
            orientation === "left" ? ChevronLeft : orientation === "right" ? ChevronRight : ChevronDown;
          return <Icon className={cn("size-4", className)} {...chevronProps} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

function CalendarDayButton({ className, day, modifiers, ...props }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "h-7 w-7 min-w-7 rounded-md p-0 font-normal leading-none",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",
        "data-[range-start=true]:rounded-r-none data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground",
        "data-[range-end=true]:rounded-l-none data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };

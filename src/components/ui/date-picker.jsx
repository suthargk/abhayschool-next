"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({ value, onChange, placeholder = "Pick a date" }) {
  const date = value ? new Date(value) : undefined;

  return (
    <div className="flex items-center gap-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? format(date, "MMM d, yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d ? d.toISOString() : null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {date ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => onChange(null)}
        >
          <X className="size-4" />
          <span className="sr-only">Clear date</span>
        </Button>
      ) : null}
    </div>
  );
}

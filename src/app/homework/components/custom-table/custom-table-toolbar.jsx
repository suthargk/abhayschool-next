import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Cross2Icon } from "@radix-ui/react-icons";
import React from "react";

import { classrooms, subjects } from "../../layout";
import Select from "@/components/select";
import CustomTableViewOptions from "./custom-table-view-options";

const CalendarButton = ({ className }) => {
  return (
    <Button variant="outline" className={`p-2 gap-2 text-xs ${className}`}>
      <CalendarIcon className="h-4 w-4" />
      <span>Calendar</span>
    </Button>
  );
};

const CustomTableToolbar = ({ table }) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center flex-col md:flex-row space-y-2 sm:space-y-4 md:space-y-0">
      <div className="flex flex-1 items-center space-x-2 w-full">
        <Input
          placeholder="Search homework..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 md:w-[250px] p-4 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:border-dashed"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}

        <CalendarButton className={`sm:hidden`} />
      </div>

      <div className="flex gap-2 md:hidden w-full">
        <Select list={classrooms} title="Classroom" />
        <Select list={subjects} title="Subject" />
        <CalendarButton className={`hidden sm:flex`} />
      </div>

      <CustomTableViewOptions table={table} />
    </div>
  );
};

export default CustomTableToolbar;

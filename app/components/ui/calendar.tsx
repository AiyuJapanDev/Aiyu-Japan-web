import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 w-[280px]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3 w-full",
        caption: "flex justify-center relative items-center mb-3",
        caption_label: "text-sm font-semibold text-slate-700",
        nav: "flex items-center",
        nav_button: 
          "inline-flex items-center justify-center h-7 w-7 bg-transparent hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50",
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-spacing-0",
        head_row: "flex justify-between w-full mb-2",
        head_cell: "text-slate-500 text-xs font-medium text-center w-[36px] h-[32px] flex items-center justify-center",
        row: "flex justify-between w-full mt-0.5",
        cell: "text-center text-sm relative p-0 w-[36px] h-[36px] flex items-center justify-center focus-within:relative focus-within:z-20",
        day: "inline-flex items-center justify-center w-[36px] h-[36px] rounded-md hover:bg-slate-100 text-slate-900 font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
        day_selected: "!bg-blue-500 !text-white hover:!bg-blue-600 focus:!bg-blue-600",
        day_today: "bg-slate-100 font-semibold",
        day_outside: "text-slate-400 opacity-50",
        day_disabled: "text-slate-300 opacity-50 cursor-not-allowed hover:!bg-transparent",
        day_range_start: "!bg-blue-500 !text-white hover:!bg-blue-600",
        day_range_end: "!bg-blue-500 !text-white hover:!bg-blue-600",
        day_range_middle: "!bg-blue-100 !text-blue-900 hover:!bg-blue-200",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
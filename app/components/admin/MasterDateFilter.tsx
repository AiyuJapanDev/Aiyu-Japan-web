import { useState } from "react";
import Calendar from "react-calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import "react-calendar/dist/Calendar.css";

interface MasterDateFilterProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
}

type DateRange = [Date, Date] | null;

export function MasterDateFilter({ onDateRangeChange, className = "" }: MasterDateFilterProps) {
  const { t } = useApp();
  const [value, setValue] = useState<DateRange>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (newValue: Date | [Date | null, Date | null] | null) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const [start, end] = newValue;
      
      if (start && end) {
        setValue([start, end]);
        onDateRangeChange(start, end);
        setIsOpen(false);
      } else if (start && !end) {
        setValue([start, start]);
      }
    }
  };

  const handleReset = () => {
    setValue(null);
    onDateRangeChange(null, null);
  };

  const formatDateRange = () => {
    if (!value || !value[0] || !value[1]) {
      return t("statsSelectDateRange") || "Seleccionar rango de fechas";
    }

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    };

    return `${formatDate(value[0])} - ${formatDate(value[1])}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`rounded-xl border-blue-100 h-10 bg-slate-50/30 justify-start text-left font-normal ${
              !value ? "text-slate-500" : "text-slate-900"
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              onChange={handleDateChange}
              value={value}
              selectRange={true}
              allowPartialRange={true}
              locale={t("language") === "es" ? "es-ES" : "en-US"}
              className="rounded-lg border-0"
              tileClassName={({ date, view }) => {
                if (view === "month" && value && value[0]) {
                  const time = date.getTime();
                  const startTime = value[0].getTime();
                  const endTime = value[1] ? value[1].getTime() : startTime;
                  
                  if (time === startTime || time === endTime) {
                    return "bg-blue-500 text-white hover:bg-blue-600";
                  }
                  
                  if (time > startTime && time < endTime) {
                    return "bg-blue-100 hover:bg-blue-200";
                  }
                }
                return "";
              }}
            />
          </div>
        </PopoverContent>
      </Popover>

      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-600"
          title={t("statsClearFilter") || "Limpiar filtro"}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

import { fr } from "date-fns/locale";
import { format, isValid } from "date-fns";

import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../../lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ date, onDateChange, className }: DatePickerProps) {
  // Check if the date is valid
  const isValidDate = date && isValid(date) && !isNaN(date.getTime());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="xs"
          variant="outline"
          className={cn(
            "justify-start gap-1.5 bg-transparent text-left font-normal shadow-none",
            !isValidDate && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="size-3.5" />
          {isValidDate ? (
            format(date, "d MMM yyyy", { locale: fr })
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isValidDate ? date : undefined}
          onSelect={onDateChange}
          autoFocus
          className="p-2"
        />
      </PopoverContent>
    </Popover>
  );
}

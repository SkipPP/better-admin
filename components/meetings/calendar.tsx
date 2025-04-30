import { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, format, startOfWeek, subDays } from "date-fns";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

import { EventForm } from "~/components/meetings/event-form";

// Define event type
export type CalendarEvent = {
  id: number;
  title: string;
  day: Date;
  startTime: string;
  endTime: string;
  color: string;
};

// Sample events data
const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Team Meeting",
    day: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Project Review",
    day: addDays(new Date(), 1),
    startTime: "14:00",
    endTime: "15:30",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Client Call",
    day: addDays(new Date(), 2),
    startTime: "11:00",
    endTime: "12:00",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Lunch Break",
    day: new Date(),
    startTime: "12:00",
    endTime: "13:00",
    color: "bg-yellow-500",
  },
];

// Time slots from 8:00 to 18:00
const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8;
  return `${hour}:00`;
});

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate array of days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  // Navigate to current week
  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  // Check if a day is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Get events for a specific day and time slot
  const getEventsForTimeSlot = (day: Date, timeSlot: string) => {
    return events.filter((event) => {
      const eventDay = new Date(event.day);
      return (
        eventDay.getDate() === day.getDate() &&
        eventDay.getMonth() === day.getMonth() &&
        eventDay.getFullYear() === day.getFullYear() &&
        event.startTime === timeSlot
      );
    });
  };

  // Add a new event
  const addEvent = (newEvent: Omit<CalendarEvent, "id">) => {
    const event = {
      ...newEvent,
      id: events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1,
    };
    setEvents([...events, event]);
  };

  return (
    <div className="flex flex-1 flex-col rounded-lg border border-dashed">
      {/* Header section */}
      <div className="flex flex-none items-center justify-between border-b pb-2">
        <h2 className="text-xl font-semibold">
          {format(startOfCurrentWeek, "d")} -{" "}
          {format(addDays(startOfCurrentWeek, 6), "d MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <EventForm onAddEvent={addEvent} />
        </div>
      </div>

      {/* Calendar day headers */}
      <div className="bg-muted/10 grid grid-cols-8 border-b">
        {/* Empty cell for time column */}
        <div className="border-r p-1 text-center"></div>

        {/* Day headers */}
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col border-r p-2 last:border-r-0",
              isToday(day) ? "bg-primary/5" : "",
            )}
          >
            <div className="text-muted-foreground text-center text-sm font-medium">
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "text-center text-xl",
                isToday(day) ? "text-primary font-bold" : "",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid h-auto grid-cols-8">
          {/* Time column */}
          <div className="border-r">
            {TIME_SLOTS.map((time, index) => (
              <div
                key={index}
                className="text-muted-foreground flex h-14 items-center border-b px-2 py-1 text-right text-xs last:border-b-0"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={cn(
                "border-r last:border-r-0",
                isToday(day) ? "bg-primary/5" : "",
              )}
            >
              {TIME_SLOTS.map((timeSlot, timeIndex) => {
                const events = getEventsForTimeSlot(day, timeSlot);

                return (
                  <div
                    key={timeIndex}
                    className="relative h-14 border-b p-1 last:border-b-0"
                  >
                    {events.map((event) => {
                      const hourDiff =
                        Number.parseInt(event.endTime.split(":")[0]) -
                        Number.parseInt(event.startTime.split(":")[0]);
                      return (
                        <div
                          key={event.id}
                          className={cn(
                            "absolute inset-x-1 overflow-hidden rounded p-1 text-xs text-white",
                            event.color,
                          )}
                          style={{
                            top: "2px",
                            height:
                              hourDiff > 1
                                ? `calc(${hourDiff} * 3.5rem - 4px)`
                                : "calc(3.5rem - 4px)",
                            minHeight: "20px",
                            zIndex: 10,
                          }}
                        >
                          <div className="truncate font-medium">{event.title}</div>
                          <div className="truncate">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

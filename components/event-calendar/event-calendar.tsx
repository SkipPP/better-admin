import { useEffect, useMemo, useState, useCallback } from "react";

import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  LucideCalendarSync,
} from "lucide-react";

import { toast } from "sonner";

import {
  addHoursToDate,
  AgendaDaysToShow,
  AgendaView,
  CalendarDndProvider,
  CalendarEvent,
  CalendarView,
  DayView,
  EventDialog,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
} from "~/components/event-calendar";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { CreateMeeting, Meeting } from "~/server/types";
import { fr } from "date-fns/locale";

export interface EventCalendarProps {
  initialView?: CalendarView;
  events?: Meeting[];
  className?: string;
  onEventAdd?: (event: Meeting) => void;
  onEventUpdate?: (event: Meeting) => void;
  onEventDelete?: (eventId: string) => void;
  userId?: string;
  organizationId?: string;
}

const defaultEvents: Meeting[] = [];

export function EventCalendar({
  initialView = "month",
  events = defaultEvents,
  className,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  userId,
  organizationId,
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Meeting | null>(null);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleEventSelect = useCallback((event: Meeting) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  }, []);

  const handleEventCreate = useCallback(
    (startTime: Date) => {
      // Create a new date object to avoid mutating the input
      const adjustedTime = new Date(startTime);

      // Snap to 15-minute intervals
      const minutes = adjustedTime.getMinutes();
      const remainder = minutes % 15;
      const adjustedMinutes =
        remainder < 7.5 ? minutes - remainder : minutes + (15 - remainder);

      adjustedTime.setMinutes(adjustedMinutes);
      adjustedTime.setSeconds(0);
      adjustedTime.setMilliseconds(0);

      if (!userId || !organizationId) {
        toast.error("Missing user or organization information");
        return;
      }

      const newEvent: Meeting = {
        id: crypto.randomUUID(), // More secure than Math.random
        title: "",
        description: null, // Fix type error by explicitly setting as null
        date: adjustedTime,
        start: adjustedTime,
        end: addHoursToDate(adjustedTime, 1),
        allDay: false,
        ownerId: userId,
        organizationId: organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
        teamId: null, // Fix type error by explicitly setting as null
      };

      setSelectedEvent(newEvent);
      setIsEventDialogOpen(true);
    },
    [userId, organizationId],
  );

  const handleEventSave = useCallback(
    (event: Meeting) => {
      if (event.id) {
        onEventUpdate?.(event);
        toast.info(`Event "${event.title}" updated`, {
          description: format(new Date(event.start), "MMM d, yyyy"),
        });
      } else {
        onEventAdd?.({
          ...event,
          id: crypto.randomUUID(), // More secure than Math.random
        });
        toast.success(`Event "${event.title}" added`, {
          description: format(new Date(event.start), "MMM d, yyyy"),
        });
      }
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
    },
    [onEventAdd, onEventUpdate],
  );

  const handleEventDelete = useCallback(
    (eventId: string) => {
      const deletedEvent = events.find((e) => e.id === eventId);
      onEventDelete?.(eventId);
      setIsEventDialogOpen(false);
      setSelectedEvent(null);

      if (deletedEvent) {
        toast.success(`Event "${deletedEvent.title}" deleted`, {
          description: format(new Date(deletedEvent.start), "MMM d, yyyy"),
        });
      }
    },
    [events, onEventDelete],
  );

  const handlePrevious = useCallback(() => {
    setCurrentDate((prevDate) => {
      if (view === "month") return subMonths(prevDate, 1);
      if (view === "week") return subWeeks(prevDate, 1);
      if (view === "day") return addDays(prevDate, -1);
      return addDays(prevDate, -AgendaDaysToShow);
    });
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate((prevDate) => {
      if (view === "month") return addMonths(prevDate, 1);
      if (view === "week") return addWeeks(prevDate, 1);
      if (view === "day") return addDays(prevDate, 1);
      return addDays(prevDate, AgendaDaysToShow);
    });
  }, [view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Clean up keyboard event listener on unmount
  useEffect(() => {
    if (isEventDialogOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "s":
          setView("week");
          break;
        case "j":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEventDialogOpen]);

  // Memoize view title to prevent unnecessary recalculations
  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: fr });
    }

    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return isSameMonth(start, end)
        ? format(start, "MMMM yyyy", { locale: fr })
        : `${format(start, "MMM", { locale: fr })} - ${format(end, "MMM yyyy", { locale: fr })}`;
    }

    if (view === "day") {
      return (
        <>
          <span className="min-[480px]:hidden" aria-hidden="true">
            {format(currentDate, "MMM d, yyyy", { locale: fr })}
          </span>

          <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, "MMMM d, yyyy", { locale: fr })}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, "EEE MMMM d, yyyy", { locale: fr })}
          </span>
        </>
      );
    }

    // Agenda view
    const start = currentDate;
    const end = addDays(currentDate, AgendaDaysToShow - 1);
    return isSameMonth(start, end)
      ? format(start, "MMMM yyyy", { locale: fr })
      : `${format(start, "MMM", { locale: fr })} - ${format(end, "MMM yyyy", { locale: fr })}`;
  }, [currentDate, view]);

  return (
    <div
      className="flex flex-1 flex-col rounded-lg border border-dashed"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider
        onEventUpdate={(event: Meeting) => {
          onEventUpdate?.(event);

          toast.info(`Event "${event.title}" moved`, {
            description: format(new Date(event.start), "MMM d, yyyy", { locale: fr }),
          });
        }}
      >
        <div className={cn("flex items-center justify-between p-2 sm:p-4", className)}>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button size="icon" variant="outline" onClick={handleToday}>
              <LucideCalendarSync size={16} aria-hidden="true" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              aria-label="Previous"
            >
              <ChevronLeftIcon size={16} aria-hidden="true" />
            </Button>

            <Button variant="ghost" size="icon" onClick={handleNext} aria-label="Next">
              <ChevronRightIcon size={16} aria-hidden="true" />
            </Button>

            <h2 className="text-sm font-semibold sm:text-lg md:text-xl">{viewTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EyeIcon size={16} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem onClick={() => setView("month")}>
                  Mois <DropdownMenuShortcut>M</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setView("week")}>
                  Semaine <DropdownMenuShortcut>S</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setView("day")}>
                  Jour <DropdownMenuShortcut>J</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setView("agenda")}>
                  Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <Button
              size="icon"
              onClick={() => {
                setSelectedEvent(null); // Ensure we're creating a new event
                setIsEventDialogOpen(true);
              }}
            >
              <PlusIcon size={16} aria-hidden="true" />

              <span className="sr-only">New event</span>
            </Button> */}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}

          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}

          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}

          {view === "agenda" && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )}
        </div>

        <EventDialog
          event={selectedEvent}
          isOpen={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
        />
      </CalendarDndProvider>
    </div>
  );
}

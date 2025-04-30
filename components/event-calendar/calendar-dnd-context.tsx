import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { addMinutes, differenceInMinutes } from "date-fns";

import { EventItem, type CalendarEvent } from "~/components/event-calendar";

import { Meeting } from "~/server/types";

// Improved type definitions
type CalendarView = "month" | "week" | "day";

type DragHandlePosition = {
  x?: number;
  y?: number;
  data?: {
    isFirstDay?: boolean;
    isLastDay?: boolean;
  };
};

type CalendarDndContextType = {
  activeEvent: Meeting | null;
  activeId: UniqueIdentifier | null;
  activeView: CalendarView | null;
  currentTime: Date | null;
  eventHeight: number | null;
  isMultiDay: boolean;
  multiDayWidth: number | null;
  dragHandlePosition: DragHandlePosition | null;
};

// Utility functions extracted for better organization and testing
const roundToNearestFifteen = (time: number): { hours: number; minutes: number } => {
  const hours = Math.floor(time);
  const fractionalHour = time - hours;
  let minutes = 0;

  if (fractionalHour < 0.125) minutes = 0;
  else if (fractionalHour < 0.375) minutes = 15;
  else if (fractionalHour < 0.625) minutes = 30;
  else minutes = 45;

  return { hours, minutes };
};

const hasTimeChanged = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.getHours() !== date2.getHours() ||
    date1.getMinutes() !== date2.getMinutes() ||
    date1.getDate() !== date2.getDate() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getFullYear() !== date2.getFullYear()
  );
};

// Create the context with a meaningful default value
const CalendarDndContext = createContext<CalendarDndContextType>({
  activeEvent: null,
  activeId: null,
  activeView: null,
  currentTime: null,
  eventHeight: null,
  isMultiDay: false,
  multiDayWidth: null,
  dragHandlePosition: null,
});

// Hook to use the context
export const useCalendarDnd = () => {
  const context = useContext(CalendarDndContext);
  if (!context) {
    throw new Error("useCalendarDnd must be used within a CalendarDndProvider");
  }
  return context;
};

interface CalendarDndProviderProps {
  children: ReactNode;
  onEventUpdate: (event: Meeting) => void;
}

export function CalendarDndProvider({
  children,
  onEventUpdate,
}: CalendarDndProviderProps) {
  const [activeEvent, setActiveEvent] = useState<Meeting | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeView, setActiveView] = useState<CalendarView | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [eventHeight, setEventHeight] = useState<number | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [multiDayWidth, setMultiDayWidth] = useState<number | null>(null);
  const [dragHandlePosition, setDragHandlePosition] = useState<DragHandlePosition | null>(
    null,
  );

  // Store original event dimensions with proper typing
  const eventDimensions = useRef<{ height: number }>({ height: 0 });

  // Memoize sensors configuration
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const dndContextId = useId();

  // Memoize handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (!active.data.current) {
      console.error("Missing data in drag start event", event);
      return;
    }

    const {
      event: calendarEvent,
      view,
      height,
      isMultiDay: eventIsMultiDay,
      multiDayWidth: eventMultiDayWidth,
      dragHandlePosition: eventDragHandlePosition,
    } = active.data.current as {
      event: Meeting;
      view: CalendarView;
      height?: number;
      isMultiDay?: boolean;
      multiDayWidth?: number;
      dragHandlePosition?: DragHandlePosition;
    };

    // Batch state updates
    const updates = {
      activeEvent: calendarEvent,
      activeId: active.id,
      activeView: view,
      currentTime: new Date(calendarEvent.start),
      isMultiDay: eventIsMultiDay || false,
      multiDayWidth: eventMultiDayWidth || null,
      dragHandlePosition: eventDragHandlePosition || null,
    };

    setActiveEvent(updates.activeEvent);
    setActiveId(updates.activeId);
    setActiveView(updates.activeView);
    setCurrentTime(updates.currentTime);
    setIsMultiDay(updates.isMultiDay);
    setMultiDayWidth(updates.multiDayWidth);
    setDragHandlePosition(updates.dragHandlePosition);

    if (height) {
      eventDimensions.current.height = height;
      setEventHeight(height);
    }
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;
      if (!over?.data.current || !activeEvent) return;

      const { date, time } = over.data.current as { date: Date; time?: number };

      if (time !== undefined && activeView !== "month") {
        const newTime = new Date(date);
        const { hours, minutes } = roundToNearestFifteen(time);
        newTime.setHours(hours, minutes, 0, 0);

        if (hasTimeChanged(newTime, currentTime)) {
          setCurrentTime(newTime);
        }
      } else if (activeView === "month" && currentTime) {
        const newTime = new Date(date);
        newTime.setHours(
          currentTime.getHours(),
          currentTime.getMinutes(),
          currentTime.getSeconds(),
          currentTime.getMilliseconds(),
        );

        if (hasTimeChanged(newTime, currentTime)) {
          setCurrentTime(newTime);
        }
      }
    },
    [activeEvent, activeView, currentTime],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || !activeEvent || !currentTime) {
        // Reset all state in one batch
        const resetState = () => {
          setActiveEvent(null);
          setActiveId(null);
          setActiveView(null);
          setCurrentTime(null);
          setEventHeight(null);
          setIsMultiDay(false);
          setMultiDayWidth(null);
          setDragHandlePosition(null);
        };
        resetState();
        return;
      }

      try {
        if (!active.data.current || !over.data.current) {
          throw new Error("Missing data in drag event");
        }

        const activeData = active.data.current as {
          event: Meeting;
          view: string;
        };
        const overData = over.data.current as { date: Date; time?: number };

        const newStart = new Date(overData.date);

        if (overData.time !== undefined) {
          const { hours, minutes } = roundToNearestFifteen(overData.time);
          newStart.setHours(hours, minutes, 0, 0);
        } else {
          newStart.setHours(
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds(),
            currentTime.getMilliseconds(),
          );
        }

        const originalStart = new Date(activeEvent.start);
        const originalEnd = new Date(activeEvent.end);
        const durationMinutes = differenceInMinutes(originalEnd, originalStart);
        const newEnd = addMinutes(newStart, durationMinutes);

        if (hasTimeChanged(originalStart, newStart)) {
          onEventUpdate({
            ...activeEvent,
            start: newStart,
            end: newEnd,
          });
        }
      } catch (error) {
        console.error("Error in drag end handler:", error);
      } finally {
        // Reset all state in one batch
        const resetState = () => {
          setActiveEvent(null);
          setActiveId(null);
          setActiveView(null);
          setCurrentTime(null);
          setEventHeight(null);
          setIsMultiDay(false);
          setMultiDayWidth(null);
          setDragHandlePosition(null);
        };
        resetState();
      }
    },
    [activeEvent, currentTime, onEventUpdate],
  );

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      activeEvent,
      activeId,
      activeView,
      currentTime,
      eventHeight,
      isMultiDay,
      multiDayWidth,
      dragHandlePosition,
    }),
    [
      activeEvent,
      activeId,
      activeView,
      currentTime,
      eventHeight,
      isMultiDay,
      multiDayWidth,
      dragHandlePosition,
    ],
  );

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <CalendarDndContext.Provider value={contextValue}>
        {children}

        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeEvent && activeView && (
            <div
              style={{
                height: eventHeight ? `${eventHeight}px` : "auto",
                width: isMultiDay && multiDayWidth ? `${multiDayWidth}%` : "100%",
              }}
            >
              <EventItem
                event={activeEvent}
                view={activeView}
                isDragging={true}
                showTime={activeView !== "month"}
                currentTime={currentTime || undefined}
                isFirstDay={dragHandlePosition?.data?.isFirstDay !== false}
                isLastDay={dragHandlePosition?.data?.isLastDay !== false}
              />
            </div>
          )}
        </DragOverlay>
      </CalendarDndContext.Provider>
    </DndContext>
  );
}

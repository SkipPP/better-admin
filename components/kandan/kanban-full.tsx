import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Kandan } from "~/components/kandan";
import { Button } from "~/components/ui/button";
import { KandanFilters } from "~/components/kandan/filters";
import {
  Filter,
  Status,
  FilterIcon,
  FilterType,
  FilterOperator,
} from "~/components/ui/filters";

import { Task } from "~/server/schema";

type KandanFullProps = {
  tasks: Task[];
};

export default function KandanFull({ tasks }: KandanFullProps) {
  const [filters, setFilters] = useState<Filter[]>([]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // If no filters, show all tasks
      if (filters.length === 0) {
        return true;
      }

      // Apply each filter
      return filters.every((filter) => {
        switch (filter.type) {
          case FilterType.STATUS:
            const operator = filter.operator;

            if (operator === FilterOperator.IS_ANY_OF) {
              return filter.value.includes(task.status);
            } else if (operator === FilterOperator.IS_NOT) {
              return !filter.value.includes(task.status);
            } else if (operator === FilterOperator.IS) {
              return filter.value.includes(task.status);
            } else if (operator === FilterOperator.INCLUDE) {
              return filter.value.includes(task.status);
            } else if (operator === FilterOperator.DO_NOT_INCLUDE) {
              return !filter.value.includes(task.status);
            } else if (operator === FilterOperator.INCLUDE_ALL_OF) {
              return filter.value.every((value) => task.status.includes(value));
            }
          case FilterType.PRIORITY:
            const priorityOperator = filter.operator;

            if (priorityOperator === FilterOperator.IS_ANY_OF) {
              return filter.value.includes(task.priority);
            } else if (priorityOperator === FilterOperator.IS_NOT) {
              return !filter.value.includes(task.priority);
            } else if (priorityOperator === FilterOperator.IS) {
              return filter.value.includes(task.priority);
            } else if (priorityOperator === FilterOperator.INCLUDE) {
              return filter.value.includes(task.priority);
            } else if (priorityOperator === FilterOperator.DO_NOT_INCLUDE) {
              return !filter.value.includes(task.priority);
            } else if (priorityOperator === FilterOperator.INCLUDE_ALL_OF) {
              return filter.value.every((value) => task.priority.includes(value));
            }
          case FilterType.DUE_DATE:
            // Add due date filtering logic here
            return true;
          case FilterType.ASSIGNEE:
            const assigneeOperator = filter.operator;

            const hasAssignee = task.assignees?.some((assignee) =>
              filter.value.includes(assignee),
            );

            if (assigneeOperator === FilterOperator.IS_ANY_OF) {
              return hasAssignee;
            } else if (assigneeOperator === FilterOperator.IS_NOT) {
              return !hasAssignee;
            } else if (assigneeOperator === FilterOperator.IS) {
              return hasAssignee;
            } else if (assigneeOperator === FilterOperator.INCLUDE) {
              return hasAssignee;
            } else if (assigneeOperator === FilterOperator.DO_NOT_INCLUDE) {
              return !hasAssignee;
            } else if (assigneeOperator === FilterOperator.INCLUDE_ALL_OF) {
              return filter.value.every((value) => task.assignees?.includes(value));
            }
          case FilterType.LABELS:
            const labelOperator = filter.operator;

            const hasLabel =
              task.tags?.some((tag) => filter.value.includes(tag.label)) ?? false;

            if (labelOperator === FilterOperator.IS_ANY_OF) {
              return hasLabel;
            } else if (labelOperator === FilterOperator.IS_NOT) {
              return !hasLabel;
            } else if (labelOperator === FilterOperator.IS) {
              return hasLabel;
            } else if (labelOperator === FilterOperator.INCLUDE) {
              return hasLabel;
            } else if (labelOperator === FilterOperator.DO_NOT_INCLUDE) {
              return !hasLabel;
            } else if (labelOperator === FilterOperator.INCLUDE_ALL_OF) {
              return (
                filter.value.every((value) =>
                  task.tags?.some((tag) => tag.label === value),
                ) ?? false
              );
            }
          default:
            return true;
        }
      });
    });
  }, [filters]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(filteredTasks.map((task) => task.status))];

    return uniqueStatuses;
  }, [filteredTasks]);

  const statusOrder: Record<Status, number> = {
    [Status.BACKLOG]: -1,
    [Status.TODO]: 0,
    [Status.IN_PROGRESS]: 1,
    [Status.IN_REVIEW]: 2,
    [Status.DONE]: 3,
    [Status.CANCELLED]: 4,
  };

  const tasksByStatus = useMemo(() => {
    return statuses.reduce(
      (acc, status) => {
        acc[status] = filteredTasks
          .filter((task) => task.status === status)
          .sort((a, b) => {
            // First sort by status
            const statusDiff =
              statusOrder[a.status as Status] - statusOrder[b.status as Status];

            if (statusDiff !== 0) {
              return statusDiff;
            }

            // Then sort by priority
            return a.priority.localeCompare(b.priority);
          });

        return acc;
      },
      {} as Record<string, Task[]>,
    );
  }, [statuses, filteredTasks]);

  return (
    <>
      <header className="flex w-full items-center justify-between">
        <KandanFilters onFiltersChange={setFilters} />

        <Button variant="dashed" size="sm" className="shadow-none">
          Add a category
        </Button>
      </header>

      <div className="flex h-full w-full gap-4 overflow-x-auto rounded-sm pb-3">
        <AnimatePresence mode="popLayout">
          {statuses.map((status) => (
            <motion.div
              key={status}
              layout
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: statusOrder[status as Status] * 0.1,
                layout: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: statusOrder[status as Status] * 0.1,
                },
              }}
              exit={{
                y: -100,
                opacity: 0,
                transition: {
                  duration: 0.3,
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  delay: statusOrder[status as Status] * 0.1,
                },
              }}
            >
              <Kandan
                key={status}
                tasks={tasksByStatus[status]}
                cardTitle={status}
                cardIcon={<FilterIcon type={status} />}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

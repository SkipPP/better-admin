import { useState } from "react";

import {
  Check,
  FileText,
  OctagonIcon,
  MessageSquare,
  AlertOctagonIcon,
  CircleCheckIcon,
} from "lucide-react";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { TaskTag } from "./task-tag";
import { DrawerMemo } from "./task-drawer";
import { DatePicker } from "../ui/date-picker";

import { Task } from "~/server/schema";

type KandanTaskCardProps = {
  task: Task;
  cardIcon: React.ReactNode;
};

export function KandanTaskCard({ task, cardIcon }: KandanTaskCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DrawerMemo open={open} setOpen={setOpen} task={task} />

      <div className="bg-card dark:bg-sidebar-accent/60 text-secondary-foreground is-last:mb-0 mb-3 rounded-md border px-3 py-2 hover:shadow-sm dark:border-none">
        <div className="mb-3 flex cursor-grab items-center justify-between select-none active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <span className="bg-sidebar flex h-6.5 w-6.5 items-center justify-center rounded-sm">
              {cardIcon}
            </span>

            <span
              data-checked={task.status === "Done"}
              className="font-medium data-[checked=true]:line-through"
            >
              {task.title}
            </span>
          </div>

          {task.priority === "High" ? (
            <AlertOctagonIcon className="size-4 text-red-500" />
          ) : (
            <OctagonIcon className="size-4 text-blue-300" />
          )}
        </div>

        <div onClick={() => setOpen(true)} className="cursor-pointer">
          <p
            data-checked={task.status === "Done"}
            className="mb-3 text-sm data-[checked=true]:line-through"
          >
            {task.description}
          </p>

          {task.todos && task.todos.length > 0 && (
            <div className="mb-3 flex flex-col gap-1">
              {task.todos
                .filter((todo) => todo.completed === false)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="is-last:rounded-b-md is-not-last:rounded-t-md flex cursor-default items-center gap-3 rounded-md hover:underline"
                  >
                    <Checkbox
                      className="size-4"
                      defaultChecked={todo.completed}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />

                    <span className="text-muted-foreground text-sm">{todo.title}</span>
                  </div>
                ))}

              <span className="flex items-center gap-3">
                <CircleCheckIcon className="text-muted-foreground size-4" />

                <span className="text-muted-foreground text-sm">
                  {task.todos?.filter((todo) => todo.completed).length}/
                  {task.todos?.length} done
                </span>
              </span>
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <TaskTag key={index} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <hr className="my-3 border-dashed" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DatePicker date={task.dueDate ?? undefined} />

            {task.files && task.files.length > 0 && (
              <Button
                size="xs"
                variant="outline"
                className="gap-1.5 bg-transparent shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <FileText className="size-3.5" /> {task.files.length}
              </Button>
            )}

            {task.comments && task.comments.length > 0 && (
              <Button
                size="xs"
                variant="outline"
                className="gap-1.5 bg-transparent shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <MessageSquare className="size-3.5" /> {task.comments.length}
              </Button>
            )}

            {task.progress && task.progress > 1 && (
              <Button
                size="xs"
                variant="outline"
                className="gap-1.5 bg-transparent font-normal shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <Check className="size-3.5" /> {task.progress}%
              </Button>
            )}
          </div>

          <div className="flex -space-x-2">
            {task.assignees?.map((assignee) => (
              <Avatar key={assignee} title={assignee} className="size-5">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{assignee.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

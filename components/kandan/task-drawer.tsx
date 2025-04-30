import { z } from "zod";
import { useRouter } from "@tanstack/react-router";
import { memo, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { EyeIcon, TrashIcon, OctagonIcon, AlertOctagonIcon } from "lucide-react";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Drawer,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
  DrawerClose,
} from "~/components/ui/drawer";

import { TaskTag } from "./task-tag";
import { DatePicker } from "../ui/date-picker";

import { Task } from "~/server/schema";
import { createTaskSchema } from "~/lib/constants/validators/task";
import { createOrganizationTask, updateOrganizationTask } from "~/server/tasks";

// Memoize the dialog content to prevent unnecessary rerenders
export const DrawerMemo = memo(function DrawerContentMemo({
  task,
  open,
  setOpen,
}: {
  task: Task | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(
    (formData: FormData) => {
      const data = {
        id: formData.get("id") as string,
        title: formData.get("title") as string,
        status: formData.get("status") as string,
        priority: formData.get("priority") as string,
        description: formData.get("description") as string,
      };

      try {
        createTaskSchema.parse(data);
        setErrors({});

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};

          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as string] = err.message;
            }
          });

          setErrors(newErrors);
        }

        return false;
      }
    },
    [setErrors],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      if (!validateForm(formData)) return;

      setIsLoading(true);

      if (task) {
        await updateOrganizationTask({ data: formData })
          .then(() => {
            toast.success("Tâche modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
          })
          .catch((error) => {
            toast.error("Une erreur est survenue :", {
              description: error.message,
            });
          })
          .finally(() => {
            setIsLoading(false);
            setOpen(false);
          });
      } else {
        await createOrganizationTask({ data: formData })
          .then(() => {
            toast.success("Tâche créée avec succès");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
          })
          .catch((error) => {
            toast.error("Une erreur est survenue :", {
              description: error.message,
            });
          })
          .finally(() => {
            setIsLoading(false);
            setOpen(false);
          });
      }
    },
    [queryClient, setOpen, task, validateForm],
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="bg-card min-w-[700px]">
        <form onSubmit={handleSubmit}>
          <DrawerHeader>
            {task ? (
              <>
                <div className="flex items-center justify-between">
                  <DrawerTitle className="flex items-center gap-x-2">
                    {task?.priority === "High" ? (
                      <AlertOctagonIcon className="size-4 text-red-500" />
                    ) : (
                      <OctagonIcon className="size-4 text-blue-300" />
                    )}

                    {task?.title}
                  </DrawerTitle>

                  {task && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-7 w-7"
                    >
                      <TrashIcon className="size-3.5" />
                    </Button>
                  )}
                </div>

                <div className="mt-1 flex justify-between">
                  <div className="flex items-center gap-2">
                    <DatePicker date={task?.dueDate ?? undefined} />

                    {task?.tags?.map((tag) => <TaskTag key={tag.label} tag={tag} />)}
                  </div>

                  {task?.assignees && (
                    <div className="flex space-x-1">
                      {task.assignees.map((assignee) => (
                        <Avatar key={assignee} title={assignee} className="size-5">
                          <AvatarImage src="https://github.com/shadcn.png" />

                          <AvatarFallback>{assignee.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <DrawerTitle className="flex items-center gap-x-2">Add task</DrawerTitle>

                <DrawerDescription className="mt-2">
                  Create a new task to get started
                </DrawerDescription>
              </>
            )}
          </DrawerHeader>

          <hr className="my-1 border-dashed" />

          <div className="flex flex-col gap-4 p-4">
            <span className="font-medium">Informations</span>

            <input type="hidden" name="id" defaultValue={task?.id} />

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>

                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  defaultValue={task?.title}
                  className="shadow-none"
                />

                {errors["title"] && (
                  <p className="text-destructive text-xs">{errors["title"]}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>

                <Input
                  id="status"
                  name="status"
                  type="text"
                  placeholder="Status"
                  defaultValue={task?.status}
                  className="shadow-none"
                />

                {errors["status"] && (
                  <p className="text-destructive text-xs">{errors["status"]}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="priority">Priority</Label>

                <Input
                  id="priority"
                  name="priority"
                  type="text"
                  placeholder="Priority"
                  defaultValue={task?.priority}
                  className="shadow-none"
                />

                {errors["priority"] && (
                  <p className="text-destructive text-xs">{errors["priority"]}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                name="description"
                defaultValue={task?.description}
                placeholder="Description"
                className="shadow-none"
              />

              {errors["description"] && (
                <p className="text-destructive text-xs">{errors["description"]}</p>
              )}
            </div>
          </div>

          <hr className="my-1 border-dashed" />

          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Control list</span>

              <Button
                type="button"
                variant="outline"
                size="xs"
                className="bg-transparent shadow-none"
              >
                <EyeIcon className="size-3.5" /> Display on card
              </Button>
            </div>

            <div className="flex flex-col gap-0">
              {task?.todos?.map((todo) => (
                <div
                  key={todo.id}
                  className="is-last:rounded-b-md is-not-last:rounded-t-md hover:bg-secondary/60 flex items-center gap-3 rounded-md pl-2"
                >
                  <Checkbox className="size-4" defaultChecked={todo.completed} />

                  <Input
                    type="text"
                    defaultValue={todo.title}
                    className="border-none px-2 shadow-none"
                  />
                </div>
              ))}

              <div className="is-last:rounded-b-md is-not-last:rounded-t-md hover:bg-secondary/60 flex items-center gap-3 rounded-md pl-2">
                <Checkbox className="size-4" />

                <Input
                  type="text"
                  placeholder="Add a todo"
                  className="border-none px-2 shadow-none"
                />
              </div>
            </div>
          </div>

          <hr className="my-1 border-dashed" />

          <div className="flex flex-col gap-4 p-4">
            <span className="font-medium">Comments</span>

            <div className="flex flex-col gap-4">
              <div className="border-input relative rounded-lg border">
                <Textarea
                  placeholder={"Your comment"}
                  className="min-h-[80px] resize-none border-0 shadow-none focus-visible:ring-0"
                />

                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="absolute right-2 bottom-2 bg-transparent"
                >
                  Add
                </Button>
              </div>

              {task?.comments?.map((comment) => (
                <div key={comment} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{comment.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <span className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium">skip</span>

                      <span className="text-muted-foreground text-xs">Mar. 31, 2025</span>
                    </span>
                  </div>

                  <span className="text-muted-foreground text-sm">{comment}</span>
                </div>
              ))}
            </div>
          </div>

          <DrawerFooter className="flex flex-row-reverse items-center">
            <Button type="submit" variant="secondary" size="sm" disabled={isLoading}>
              {!task
                ? isLoading
                  ? "Ajout en cours..."
                  : "Ajouter"
                : isLoading
                  ? "Modification en cours..."
                  : "Mettre à jour"}
            </Button>

            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-transparent shadow-none"
                disabled={isLoading}
              >
                Annuler
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
});

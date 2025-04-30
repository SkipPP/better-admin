import { useState } from "react";

import { Plus, MoreHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import { DrawerMemo } from "./task-drawer";
import { KandanTaskCard } from "./task-card";

import { Task } from "~/server/schema";

type KandanProps = {
  cardTitle: string;
  cardIcon: React.ReactNode;
  tasks?: Task[];
};

export function Kandan({ tasks, cardTitle, cardIcon }: KandanProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DrawerMemo task={null} open={open} setOpen={setOpen} />

      <div className="bg-sidebar h-fit max-h-full w-full max-w-md min-w-md overflow-y-auto rounded-md px-4 py-0">
        <div className="sticky top-0 z-10 flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            {cardIcon}

            <span className="font-medium">{cardTitle}</span>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              size="sm"
              variant="link"
              className="p-1 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <Plus size={18} />
            </Button>

            <Button size="sm" variant="link" className="p-1 hover:text-white">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </div>

        {tasks && tasks.length > 0 ? (
          tasks?.map((task) => (
            <KandanTaskCard key={task.id} task={task} cardIcon={cardIcon} />
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground text-sm italic">No tasks created !</p>
          </div>
        )}

        {/* Add task button */}
        <div className="sticky bottom-0 py-2">
          <Button
            size="sm"
            variant="link"
            className="gap-1.5 p-0"
            onClick={() => setOpen(true)}
          >
            <Plus size={16} />

            <span className="text-sm">Add task</span>
          </Button>
        </div>
      </div>
    </>
  );
}

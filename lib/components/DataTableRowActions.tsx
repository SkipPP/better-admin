import { z } from "zod";
import { Row } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Button } from "~/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/lib/components/ui/dropdown-menu";

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
});

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Edit</DropdownMenuItem>

        <DropdownMenuItem>Make a copy</DropdownMenuItem>

        <DropdownMenuItem>Favorite</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {[
                {
                  value: "bug",
                  label: "Bug",
                },
                {
                  value: "feature",
                  label: "Feature",
                },
                {
                  value: "documentation",
                  label: "Documentation",
                },
              ].map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use no memo";

import React from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "~/lib/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/lib/components/ui/dropdown-menu";

interface DataTableRowActionsProps {
  actions: {
    label: string;
    separator: boolean;
    icon: React.ReactNode;
    dialogContent: React.ReactNode;
  }[];
}

export function DataTableRowActions({ actions }: DataTableRowActionsProps) {
  const [selectedDialogContent, setSelectedDialogContent] =
    React.useState<React.ReactNode | null>(null);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
            <MoreHorizontal />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          {actions.map((action) => (
            <React.Fragment key={action.label}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => setSelectedDialogContent(action.dialogContent)}
                >
                  {action.icon} <span>{action.label}</span>
                </DropdownMenuItem>
              </DialogTrigger>

              {action.separator && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>test</DialogContent>
    </Dialog>
  );
}

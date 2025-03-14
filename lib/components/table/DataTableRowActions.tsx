"use no memo";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "~/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/lib/components/ui/dropdown-menu";

interface DataTableRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function DataTableRowActions({ onEdit, onDelete }: DataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <MoreHorizontal />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();

            onEdit();
          }}
        >
          <Edit /> <span>Éditer</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();

            onDelete();
          }}
        >
          <Trash /> <span>Supprimer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

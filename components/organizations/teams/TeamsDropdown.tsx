import { memo, useState } from "react";

import { Team } from "~/server/types";

import { MoreHorizontal, Pencil, UserPlus, Trash } from "lucide-react";

import { FormTeamsDialog } from "./FormTeamsDialog";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "~/components/ui/dialog";

type TeamsDropdownProps = {
  team?: Team | null;
  children?: React.ReactNode;
};

function useDialogState() {
  const [dialogStates, setDialogStates] = useState({
    edit: false,
    delete: false,
    addUser: false,
  });

  const openDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: false }));
  };

  return { dialogStates, openDialog, closeDialog };
}

export const TeamsDropdown = memo(function TeamsDropdown({
  team,
  children,
}: TeamsDropdownProps) {
  const { dialogStates, openDialog, closeDialog } = useDialogState();

  return (
    <Dialog
      open={dialogStates.edit || dialogStates.delete || dialogStates.addUser}
      onOpenChange={(open) => {
        if (!open) {
          if (dialogStates.edit) {
            closeDialog("edit");
          } else if (dialogStates.delete) {
            closeDialog("delete");
          } else if (dialogStates.addUser) {
            closeDialog("addUser");
          }
        }
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children || (
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            >
              <MoreHorizontal />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[220px]">
          <DropdownMenuItem onClick={() => openDialog("edit")}>
            <Pencil /> <span>Modifier l'équipe</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => openDialog("addUser")}>
            <UserPlus /> <span>Ajouter un membre</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={() => openDialog("delete")}>
            <Trash /> <span>Supprimer l'équipe</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        {team && dialogStates.edit && <FormTeamsDialog team={team} />}

        {team && dialogStates.addUser && <span>Ajouter un membre</span>}

        {team && dialogStates.delete && <span>Supprimer l'équipe</span>}
      </DialogContent>
    </Dialog>
  );
});

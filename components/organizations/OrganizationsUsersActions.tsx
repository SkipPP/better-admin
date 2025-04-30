import { memo, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { OrganizationMember } from "~/server/types";
import {
  removeOrganizationMember,
  updateOrganizationMemberRole,
} from "~/server/organizations";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { toast } from "sonner";

import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "~/components/ui/dialog";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "../ui/select";

type DataTableRowOrganizationsUsersActionsProps = {
  organizationMember: OrganizationMember | null;
  children?: React.ReactNode;
};

const handleApiError = (error: Error) => {
  toast.error("Une erreur est survenue :", {
    description: error.message,
  });
};

function useDialogState() {
  const [dialogStates, setDialogStates] = useState({
    edit: false,
    delete: false,
    addToTeam: false,
    deleteTeam: false,
  });

  const openDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: false }));
  };

  return { dialogStates, openDialog, closeDialog };
}

export const DataTableRowOrganizationsUsersActions = memo(
  function DataTableRowOrganizationsUsersActions({
    organizationMember,
    children,
  }: DataTableRowOrganizationsUsersActionsProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { dialogStates, openDialog, closeDialog } = useDialogState();

    return (
      <Dialog
        open={
          dialogStates.edit ||
          dialogStates.delete ||
          dialogStates.addToTeam ||
          dialogStates.deleteTeam
        }
        onOpenChange={(open) => {
          if (!open) {
            if (dialogStates.edit) {
              closeDialog("edit");
            } else if (dialogStates.delete) {
              closeDialog("delete");
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

          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => openDialog("edit")}>
              <Pencil /> <span>Modifier le rôle</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" onClick={() => openDialog("delete")}>
              <Trash /> <span>Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          {organizationMember && dialogStates.edit && (
            <form
              className="grid gap-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target as HTMLFormElement);

                setIsLoading(true);

                try {
                  await updateOrganizationMemberRole({ data: formData })
                    .then(() => {
                      closeDialog("edit");

                      router.invalidate();
                      toast.success("Organisation modifiée avec succès");
                    })
                    .catch((error) => handleApiError(error));
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>Modifier le rôle</DialogTitle>

                <DialogDescription>
                  Saisissez le nouveau rôle pour l'utilisateur.
                </DialogDescription>
              </DialogHeader>

              <input type="hidden" name="userId" value={organizationMember?.id} />
              <input type="hidden" name="userRole" value={organizationMember?.role} />
              <input
                type="hidden"
                name="organizationId"
                value={organizationMember?.organizationId}
              />

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="role">Rôle</Label>

                  <Select name="role" defaultValue={organizationMember.role}>
                    <SelectTrigger id="role" className="w-full shadow-none">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="owner">Propriétaire</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="member">Membre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="shadow-none" disabled={isLoading}>
                    Annuler
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? "Modification en cours..." : "Modifier"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {organizationMember && dialogStates.delete && (
            <form
              className="grid gap-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target as HTMLFormElement);

                setIsLoading(true);

                try {
                  await removeOrganizationMember({ data: formData })
                    .then(() => {
                      closeDialog("delete");

                      router.invalidate();
                      toast.success("Membre supprimé avec succès");
                    })
                    .catch((error) => handleApiError(error));
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>Supprimer un membre</DialogTitle>

                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer le membre{" "}
                  <strong>{organizationMember.user.name}</strong> de l'organisation ?
                </DialogDescription>
              </DialogHeader>

              <input
                type="hidden"
                name="memberIdOrEmail"
                value={organizationMember?.id ?? organizationMember?.user.email}
              />
              <input
                type="hidden"
                name="organizationId"
                value={organizationMember?.organizationId}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="shadow-none" disabled={isLoading}>
                    Annuler
                  </Button>
                </DialogClose>

                <Button type="submit" variant="destructive" disabled={isLoading}>
                  {isLoading ? "Suppression en cours..." : "Supprimer"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);

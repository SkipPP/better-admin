import { memo, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { Organization, OrganizationTeam } from "~/server/auth";
import {
  deleteOrganization,
  updateOrganization,
  addMemberToOrganization,
  addTeamToOrganization,
  updateOrganizationTeam,
} from "~/server/organizations";

import { MoreHorizontal, Pencil, UserPlus, Trash, Plus } from "lucide-react";

import { toast } from "sonner";

import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Button } from "~/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/lib/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "~/lib/components/ui/dialog";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "~/lib/components/ui/select";

type DataTableRowOrganizationsActionsProps = {
  organization: Organization | null;
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
    addUser: false,
    addTeam: false,
    editTeam: false,
  });

  const openDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: false }));
  };

  return { dialogStates, openDialog, closeDialog };
}

export const DataTableRowOrganizationsActions = memo(
  function DataTableRowOrganizationsActions({
    organization,
    children,
  }: DataTableRowOrganizationsActionsProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { dialogStates, openDialog, closeDialog } = useDialogState();

    return (
      <Dialog
        open={
          dialogStates.edit ||
          dialogStates.addUser ||
          dialogStates.delete ||
          dialogStates.addTeam ||
          dialogStates.editTeam
        }
        onOpenChange={(open) => {
          if (!open) {
            if (dialogStates.edit) {
              closeDialog("edit");
            } else if (dialogStates.addUser) {
              closeDialog("addUser");
            } else if (dialogStates.delete) {
              closeDialog("delete");
            } else if (dialogStates.addTeam) {
              closeDialog("addTeam");
            } else if (dialogStates.editTeam) {
              closeDialog("editTeam");
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
              <Pencil /> <span>Modifier l'organisation</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => openDialog("addTeam")}>
              <Plus /> <span>Ajouter un équipe</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => openDialog("addUser")}>
              <UserPlus /> <span>Ajouter un utilisateur</span>
            </DropdownMenuItem>

            {/* {organization?.teams?.length > 0 && (
              <DropdownMenuItem onClick={() => openDialog("editTeam")}>
                <Pencil /> <span>Modifier une équipe</span>
              </DropdownMenuItem>
            )} */}

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" onClick={() => openDialog("delete")}>
              <Trash /> <span>Supprimer l'organisation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          {organization && dialogStates.edit && (
            <form
              className="grid gap-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target as HTMLFormElement);

                setIsLoading(true);

                try {
                  await updateOrganization({ data: formData })
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
                <DialogTitle>Modifier</DialogTitle>

                <DialogDescription>
                  Saisissez les informations à modifier pour mettre à jour l'organisation.
                </DialogDescription>
              </DialogHeader>

              <input type="hidden" name="organizationId" value={organization.id} />

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nom</Label>

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={organization.name}
                    className="shadow-none"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="slug">Slug</Label>

                  <Input
                    id="slug"
                    name="slug"
                    type="text"
                    defaultValue={organization.slug}
                    className="shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="logo">Logo</Label>

                  <Input
                    disabled
                    id="logo"
                    name="logo"
                    type="file"
                    className="shadow-none"
                  />
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

          {organization && dialogStates.addUser && (
            <form
              className="grid gap-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target as HTMLFormElement);

                setIsLoading(true);

                try {
                  await addMemberToOrganization({ data: formData })
                    .then(() => {
                      closeDialog("addUser");

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
                <DialogTitle>Ajouter un membre</DialogTitle>

                <DialogDescription>Ajoutez un membre à l'organisation.</DialogDescription>
              </DialogHeader>

              <input type="hidden" name="organizationId" value={organization.id} />

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="userId">Identifiant de l'utilisateur</Label>

                  <Input id="userId" name="userId" type="text" className="shadow-none" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="role">Rôle</Label>

                  <Select name="role" defaultValue="member">
                    <SelectTrigger id="role" className="w-full shadow-none">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="member">Membre</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="owner">Propriétaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="teamId">Équipe</Label>

                  <Select name="teamId" defaultValue={organization.team}>
                    <SelectTrigger id="teamId" className="w-full shadow-none">
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>

                    <SelectContent>
                      {organization.teams?.map((team: OrganizationTeam) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      )) ?? (
                        <SelectItem disabled value="null">
                          Aucune équipe
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <p className="text-muted-foreground text-xs">
                    Optionnel. Si aucune équipe n'est sélectionnée, le membre sera ajouté
                    sans équipe.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="shadow-none" disabled={isLoading}>
                    Annuler
                  </Button>
                </DialogClose>

                <Button type="submit" variant="secondary" disabled={isLoading}>
                  {isLoading ? "Ajout en cours..." : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {organization && dialogStates.addTeam && (
            <form
              className="grid gap-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target as HTMLFormElement);

                setIsLoading(true);

                try {
                  await addTeamToOrganization({ data: formData })
                    .then(() => {
                      closeDialog("addTeam");

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
                <DialogTitle>Ajouter un équipe</DialogTitle>

                <DialogDescription>
                  Ajoutez une équipe à l'organisation.
                </DialogDescription>
              </DialogHeader>

              <input type="hidden" name="organizationId" value={organization.id} />

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nom</Label>

                  <Input id="name" name="name" type="text" className="shadow-none" />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="shadow-none" disabled={isLoading}>
                    Annuler
                  </Button>
                </DialogClose>

                <Button type="submit" variant="secondary" disabled={isLoading}>
                  {isLoading ? "Ajout en cours..." : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {organization?.teams?.length > 0 && dialogStates.editTeam && (
            <form
              className="grid gap-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target as HTMLFormElement);

                setIsLoading(true);

                try {
                  await updateOrganizationTeam({ data: formData })
                    .then(() => {
                      closeDialog("editTeam");

                      router.invalidate();
                      toast.success("Équipe modifiée avec succès");
                    })
                    .catch((error) => handleApiError(error));
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>Modifier une équipe</DialogTitle>

                <DialogDescription>
                  Modifiez les informations de l'équipe.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="teamId">Équipe</Label>

                  <Select name="teamId" defaultValue={organization?.team?.id}>
                    <SelectTrigger id="teamId" className="w-full shadow-none">
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>

                    <SelectContent>
                      {organization?.teams?.map((team: OrganizationTeam) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      )) ?? (
                        <SelectItem disabled value="null">
                          Aucune équipe
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nom</Label>

                  <Input id="name" name="name" type="text" className="shadow-none" />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="shadow-none" disabled={isLoading}>
                    Annuler
                  </Button>
                </DialogClose>

                <Button type="submit" variant="secondary" disabled={isLoading}>
                  {isLoading ? "Modification en cours..." : "Modifier"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {organization && dialogStates.delete && (
            <form
              className="grid gap-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target as HTMLFormElement);

                setIsLoading(true);

                try {
                  await deleteOrganization({ data: formData })
                    .then(() => {
                      closeDialog("delete");

                      router.invalidate();
                      toast.success("Organisation supprimée avec succès");
                    })
                    .catch((error) => handleApiError(error));
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>Supprimer</DialogTitle>

                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer l'organisation{" "}
                  <strong>{organization.name}</strong> ?
                </DialogDescription>
              </DialogHeader>

              <input type="hidden" name="organizationId" value={organization.id} />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="shadow-none" disabled={isLoading}>
                    Annuler
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
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

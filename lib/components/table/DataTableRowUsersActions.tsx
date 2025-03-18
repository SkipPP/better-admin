"use no memo";

import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { UserWithRole } from "better-auth/plugins/admin";
import { banUser, deleteUser, setUserRole, unbanUser, updateUser } from "~/server/admin";

import { MoreHorizontal, Shield, Trash, UserCheck } from "lucide-react";

import { toast } from "sonner";
import { Label } from "~/lib/components/ui/label";
import { Input } from "~/lib/components/ui/input";
import { Button } from "~/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/lib/components/ui/dropdown-menu";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "~/lib/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "~/lib/components/ui/dialog";

type DataTableRowUsersActionsProps = {
  user: UserWithRole;
};

export function DataTableRowUsersActions({ user }: DataTableRowUsersActionsProps) {
  const router = useRouter();

  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Dialog
      open={isBanDialogOpen || isEditDialogOpen || isDeleteDialogOpen || isRoleDialogOpen}
      onOpenChange={
        isBanDialogOpen
          ? setIsBanDialogOpen
          : isEditDialogOpen
            ? setIsEditDialogOpen
            : isRoleDialogOpen
              ? setIsRoleDialogOpen
              : setIsDeleteDialogOpen
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
            <MoreHorizontal />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsBanDialogOpen(true)}>
            <Shield /> <span>Bannir</span>
          </DropdownMenuItem>

          {/* <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pencil /> <span>Modifier</span>
          </DropdownMenuItem> */}

          <DropdownMenuItem onClick={() => setIsRoleDialogOpen(true)}>
            <UserCheck /> <span>Modifier le rôle</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash /> <span>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        {isBanDialogOpen && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              if (user.banned) {
                await unbanUser({ data: formData })
                  .then(() => {
                    setIsBanDialogOpen(false);

                    router.invalidate();
                    toast.success("Utilisateur débanni avec succès");
                  })
                  .catch((error) => {
                    toast.error("Une erreur est survenue :", {
                      description: error.message,
                    });
                  });
              } else {
                await banUser({ data: formData })
                  .then(() => {
                    setIsBanDialogOpen(false);

                    router.invalidate();
                    toast.success("Utilisateur banni avec succès");
                  })
                  .catch((error) => {
                    toast.error("Une erreur est survenue :", {
                      description: error.message,
                    });
                  });
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Bannir</DialogTitle>

              <DialogDescription>
                {user.banned ? (
                  <span>
                    Voulez-vous débannir l'utilisateur <strong>{user.name}</strong> ?
                  </span>
                ) : (
                  "Saisissez la raison et la date d'expiration du bannissement."
                )}
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="userId" value={user.id} />

            {!user.banned && (
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="banReason">Raison du bannissement</Label>

                  <Select name="banReason">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une raison" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="abus">Abus</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="banExpiresIn">Date d'expiration</Label>

                  <Input id="banExpiresIn" name="banExpiresIn" type="date" />
                </div>
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>

              <Button variant="destructive">{user.banned ? "Débannir" : "Bannir"}</Button>
            </DialogFooter>
          </form>
        )}

        {isRoleDialogOpen && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              await setUserRole({ data: formData })
                .then(() => {
                  setIsRoleDialogOpen(false);

                  router.invalidate();
                  toast.success("Rôle modifié avec succès");
                })
                .catch((error) => {
                  toast.error("Une erreur est survenue :", {
                    description: error.message,
                  });
                });
            }}
          >
            <DialogHeader>
              <DialogTitle>Modifier le rôle</DialogTitle>

              <DialogDescription>
                Saisissez le nouveau rôle pour l'utilisateur <strong>{user.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="userId" value={user.id} />

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Rôle</Label>

              <Select name="role" defaultValue={user.role}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>

              <Button variant="default">Modifier</Button>
            </DialogFooter>
          </form>
        )}

        {isEditDialogOpen && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              await updateUser({ data: formData })
                .then(() => {
                  setIsEditDialogOpen(false);

                  router.invalidate();
                  toast.success("Utilisateur modifié avec succès");
                })
                .catch((error) => {
                  toast.error("Une erreur est survenue :", {
                    description: error.message,
                  });
                });
            }}
          >
            <DialogHeader>
              <DialogTitle>Modifier</DialogTitle>

              <DialogDescription>
                Saisissez les informations à modifier pour mettre à jour l'utilisateur.
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="userId" value={user.id} />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom</Label>

                <Input id="name" name="name" type="text" defaultValue={user.name} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Rôle</Label>

                <Select name="role" defaultValue={user.role}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>

              <Button variant="default">Modifier</Button>
            </DialogFooter>
          </form>
        )}

        {isDeleteDialogOpen && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              await deleteUser({ data: formData })
                .then(() => {
                  setIsDeleteDialogOpen(false);

                  router.invalidate();
                  toast.success("Utilisateur supprimé avec succès");
                })
                .catch((error) => {
                  toast.error("Une erreur est survenue :", {
                    description: error.message,
                  });
                });
            }}
          >
            <DialogHeader>
              <DialogTitle>Supprimer</DialogTitle>

              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                <strong>{user.name}</strong> ?
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="userId" value={user.id} />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>

              <Button variant="destructive">Supprimer</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

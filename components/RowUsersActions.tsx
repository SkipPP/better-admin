import { memo, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { UserWithRole } from "better-auth/plugins/admin";
import {
  banUser,
  deleteUser,
  impersonateUser,
  setUserRole,
  unbanUser,
  updateUser,
} from "~/server/admin";

import { MoreHorizontal, Shield, Trash, UserCheck, UserRound } from "lucide-react";

import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "~/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "~/components/ui/dialog";

type DataTableRowUsersActionsProps = {
  user: UserWithRole;
};

const handleApiError = (error: Error) => {
  toast.error("Une erreur est survenue :", {
    description: error.message,
  });
};

function useDialogState() {
  const [dialogStates, setDialogStates] = useState({
    ban: false,
    role: false,
    edit: false,
    delete: false,
    impersonate: false,
  });

  const openDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: false }));
  };

  return { dialogStates, openDialog, closeDialog };
}

export const DataTableRowUsersActions = memo(function DataTableRowUsersActions({
  user,
}: DataTableRowUsersActionsProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dialogStates, openDialog, closeDialog } = useDialogState();

  return (
    <Dialog
      open={
        dialogStates.ban ||
        dialogStates.edit ||
        dialogStates.delete ||
        dialogStates.role ||
        dialogStates.impersonate
      }
      onOpenChange={(open) => {
        if (!open) {
          if (dialogStates.ban) {
            closeDialog("ban");
          } else if (dialogStates.edit) {
            closeDialog("edit");
          } else if (dialogStates.role) {
            closeDialog("role");
          } else if (dialogStates.delete) {
            closeDialog("delete");
          } else if (dialogStates.impersonate) {
            closeDialog("impersonate");
          }
        }
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
            <MoreHorizontal />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => openDialog("ban")}>
            <Shield /> <span>Bannir</span>
          </DropdownMenuItem>

          {/* <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Pencil /> <span>Modifier</span>
            </DropdownMenuItem> */}

          <DropdownMenuItem disabled onClick={() => openDialog("impersonate")}>
            <UserRound /> <span>Impersoner</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => openDialog("role")}>
            <UserCheck /> <span>Modifier le rôle</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={() => openDialog("delete")}>
            <Trash /> <span>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        {dialogStates.ban && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              setIsLoading(true);

              try {
                if (user.banned) {
                  await unbanUser({ data: formData })
                    .then(() => {
                      closeDialog("ban");

                      router.invalidate();
                      toast.success("Utilisateur débanni avec succès");
                    })
                    .catch((error) => handleApiError(error));
                } else {
                  await banUser({ data: formData })
                    .then(() => {
                      closeDialog("ban");

                      router.invalidate();
                      toast.success("Utilisateur banni avec succès");
                    })
                    .catch((error) => handleApiError(error));
                }
              } finally {
                setIsLoading(false);
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
                    <SelectTrigger className="w-full shadow-none" autoFocus>
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

                  <Input
                    id="banExpiresIn"
                    name="banExpiresIn"
                    type="date"
                    className="shadow-none"
                  />
                </div>
              </div>
            )}

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
                {isLoading ? "Action en cours..." : user.banned ? "Débannir" : "Bannir"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {dialogStates.role && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              setIsLoading(true);

              try {
                await setUserRole({ data: formData })
                  .then(() => {
                    closeDialog("role");

                    router.invalidate();
                    toast.success("Rôle modifié avec succès");
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
                Saisissez le nouveau rôle pour l'utilisateur <strong>{user.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="userId" value={user.id} />

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Rôle</Label>

              <Select name="role" defaultValue={user.role}>
                <SelectTrigger id="role" className="w-full shadow-none" autoFocus>
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

        {dialogStates.edit && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              setIsLoading(true);

              try {
                await updateUser({ data: formData })
                  .then(() => {
                    closeDialog("edit");

                    router.invalidate();
                    toast.success("Utilisateur modifié avec succès");
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
                Saisissez les informations à modifier pour mettre à jour l'utilisateur.
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="userId" value={user.id} />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom</Label>

                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={user.name}
                  className="shadow-none"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Rôle</Label>

                <Select name="role" defaultValue={user.role}>
                  <SelectTrigger id="role" className="w-full shadow-none">
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

        {dialogStates.delete && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              setIsLoading(true);

              try {
                await deleteUser({ data: formData })
                  .then(() => {
                    closeDialog("delete");

                    router.invalidate();
                    toast.success("Utilisateur supprimé avec succès");
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
                Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                <strong>{user.name}</strong> ?
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="userId" value={user.id} />

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

        {dialogStates.impersonate && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              const userId = formData.get("userId") as string;

              setIsLoading(true);

              try {
                await impersonateUser({ data: { userId } })
                  .then(() => {
                    closeDialog("impersonate");

                    router.navigate({ to: "/" });
                    toast.success("Utilisateur impersoné avec succès");
                  })
                  .catch((error) => handleApiError(error));
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Impersoner</DialogTitle>

              <DialogDescription>
                Êtes-vous sûr de vouloir impersoner l'utilisateur{" "}
                <strong>{user.name}</strong> ?
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="userId" value={user.id} />

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
                {isLoading ? "Impersonation en cours..." : "Impersoner"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
});

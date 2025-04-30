import { memo, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { Session } from "~/server/auth";
import { revokeUserSession } from "~/server/admin";

import { MoreHorizontal, Shield } from "lucide-react";

import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
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

type DataTableRowSessionsActionsProps = {
  session: Session["session"];
};

const handleApiError = (error: Error) => {
  toast.error("Une erreur est survenue :", {
    description: error.message,
  });
};

function useDialogState() {
  const [dialogStates, setDialogStates] = useState({
    revoke: false,
  });

  const openDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [type]: false }));
  };

  return { dialogStates, openDialog, closeDialog };
}

export const DataTableRowSessionsActions = memo(function DataTableRowUsersActions({
  session,
}: DataTableRowSessionsActionsProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dialogStates, openDialog, closeDialog } = useDialogState();

  return (
    <Dialog
      open={dialogStates.revoke}
      onOpenChange={(open) => {
        if (!open) {
          if (dialogStates.revoke) {
            closeDialog("revoke");
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
          <DropdownMenuItem variant="destructive" onClick={() => openDialog("revoke")}>
            <Shield /> <span>Révoquer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        {dialogStates.revoke && (
          <form
            className="grid gap-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              const sessionToken = formData.get("sessionToken") as string;

              setIsLoading(true);

              try {
                await revokeUserSession({ data: { sessionToken } })
                  .then(() => {
                    closeDialog("revoke");

                    router.invalidate();
                    toast.success("Session révoquée avec succès");
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
                Êtes-vous sûr de vouloir révoquer la session ?
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="sessionToken" value={session.token} />

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
                {isLoading ? "Révocation en cours..." : "Révoquer"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
});

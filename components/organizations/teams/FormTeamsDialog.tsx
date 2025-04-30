import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";

import { Team } from "~/server/types";
import {
  createOrganizationTeam,
  updateOrganizationTeam,
} from "~/server/organization-teams";

type FormTeamsDialogProps = {
  add?: boolean;
  team?: Team | null;
  organizationId?: string;
};

export function FormTeamsDialog({ team, add, organizationId }: FormTeamsDialogProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    setIsLoading(true);

    if (!add) {
      await updateOrganizationTeam({ data: formData })
        .then(() => {
          router.invalidate();
          toast.success("Organisation modifiée avec succès");
        })
        .catch((error) => {
          toast.error("Une erreur est survenue :", {
            description: error.message,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      await createOrganizationTeam({ data: formData })
        .then(() => {
          router.invalidate();
          toast.success("Organisation créée avec succès");
        })
        .catch((error) => {
          toast.error("Une erreur est survenue :", {
            description: error.message,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <form className="grid gap-y-6" onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{add ? "Ajouter une équipe" : "Modifier l'équipe"}</DialogTitle>

        <DialogDescription>
          {add
            ? "Ajoutez une équipe à l'organisation."
            : "Modifier les informations de l'équipe."}
        </DialogDescription>
      </DialogHeader>

      <input type="hidden" name="teamId" value={team?.id} />
      <input type="hidden" name="organizationId" value={organizationId} />

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nom</Label>

          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={team?.name}
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

        <Button type="submit" variant="secondary" disabled={isLoading}>
          {add
            ? isLoading
              ? "Ajout en cours..."
              : "Ajouter"
            : isLoading
              ? "Modification en cours..."
              : "Mettre à jour"}
        </Button>
      </DialogFooter>
    </form>
  );
}

import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { Plus } from "lucide-react";

import { Label } from "~/lib/components/ui/label";
import { Input } from "~/lib/components/ui/input";
import { Button } from "~/lib/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "~/lib/components/ui/select";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "~/lib/components/ui/dialog";

import { toast } from "sonner";

import { createUser } from "~/server/admin";

export default function AddUserDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="mr-1 h-4 w-4" /> Ajouter
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>

          <DialogDescription>
            Créez un nouvel utilisateur en renseignant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-y-6"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);

            await createUser({ data: formData })
              .then(() => {
                setIsOpen(false);
                router.invalidate();
                toast.success("Utilisateur créé avec succès");
              })
              .catch((error) => {
                toast.error("Une erreur est survenue :", {
                  description: error.message,
                });
              });
          }}
        >
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nom</Label>

              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Rôle</Label>

              <Select name="role" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="user">Utilisateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

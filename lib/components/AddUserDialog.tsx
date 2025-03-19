import { z } from "zod";
import { useRouter } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";

import { Plus, Loader2 } from "lucide-react";

import { toast } from "sonner";
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

import { createUser } from "~/server/admin";

// Define validation schema
const userSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["admin", "user"], {
    message: "Veuillez sélectionner un rôle valide",
  }),
});

export default function AddUserDialog() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(
    (formData: FormData) => {
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as string,
      };

      try {
        userSchema.parse(data);
        setErrors({});

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};

          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as string] = err.message;
            }
          });

          setErrors(newErrors);
        }

        return false;
      }
    },
    [setErrors],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      if (!validateForm(formData)) return;

      setIsSubmitting(true);

      try {
        await createUser({ data: formData });

        setIsOpen(false);

        router.invalidate();
        toast.success("Utilisateur créé avec succès");
      } catch (error) {
        toast.error("Une erreur est survenue :", {
          description: error instanceof Error ? error.message : "Erreur inconnue",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, validateForm],
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && formRef.current) {
          formRef.current.reset();
          setErrors({});
        }

        setIsOpen(open);
      }}
    >
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <Plus className="mr-1 h-4 w-4" /> Ajouter
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>

          <DialogDescription>
            Créez un nouvel utilisateur en renseignant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} className="grid gap-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nom</Label>

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                aria-invalid={!!errors.name}
              />

              {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                aria-invalid={!!errors.email}
              />

              {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                aria-invalid={!!errors.password}
              />

              {errors.password && (
                <p className="text-destructive text-xs">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Rôle</Label>

              <Select name="role">
                <SelectTrigger className="w-full" aria-invalid={!!errors.role}>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="user">Utilisateur</SelectItem>
                </SelectContent>
              </Select>

              {errors.role && <p className="text-destructive text-xs">{errors.role}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Annuler
              </Button>
            </DialogClose>

            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

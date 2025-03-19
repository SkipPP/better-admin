import { z } from "zod";
import { useState, useCallback, useRef } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

import { RotateCcw, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { Card } from "~/lib/components/ui/card";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Button } from "~/lib/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "~/lib/components/ui/select";

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

export const Route = createFileRoute("/dashboard/users/add/")({
  component: AddUserRoute,
});

function AddUserRoute() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Ajouter un utilisateur</h1>

          <p className="text-muted-foreground text-sm">
            Créez un nouvel utilisateur en renseignant les informations ci-dessous.
          </p>
        </div>

        <Button size="icon" variant="secondary" onClick={() => formRef.current?.reset()}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-none py-0 shadow-none md:border-dashed md:py-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 px-0 md:px-6">
          <div className="grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
            <FormField
              label="Nom"
              name="name"
              type="text"
              placeholder="John Doe"
              errors={errors}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="user@example.com"
              errors={errors}
            />

            <FormField
              label="Mot de passe"
              name="password"
              type="password"
              placeholder="********"
              errors={errors}
            />

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

          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
            <Button asChild variant="outline" disabled={isSubmitting}>
              <Link to="/dashboard/users" search={{ limit: 10, currentPage: 0 }}>
                Annuler
              </Link>
            </Button>

            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Reusable form field component
function FormField({
  errors,
  label,
  name,
  type,
  placeholder,
}: {
  errors: Record<string, string>;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!errors[name]}
      />

      {errors[name] && <p className="text-destructive text-xs">{errors[name]}</p>}
    </div>
  );
}

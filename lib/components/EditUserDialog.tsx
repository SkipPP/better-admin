import { z } from "zod";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import authClient from "~/lib/utils/auth-client";
import { UserWithRole } from "better-auth/plugins/admin";
import { SignInButton } from "~/lib/components/auth/SignInButton";

import { toast } from "sonner";

import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "~/lib/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.string().min(1, "Le rôle est requis"),
});

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  formContext,
  fieldContext,
  fieldComponents: {
    Input,
  },
  formComponents: {
    Button,
    SignInButton,
  },
});

interface UserFormProps {
  user: UserWithRole;
}

export function UserForm({ user }: UserFormProps) {
  const form = useAppForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      role: user.role ?? "user",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.admin.createUser(value, {
        onRequest: () => {
          toast.info("Modification en cours...");
        },
        onSuccess: () => {
          toast.success("Utilisateur modifié avec succès");
        },
        onError: (error) => {
          console.error({ error });

          toast.error("Une erreur est survenue lors de la modification :", {
            description: error.error.message,
          });
        },
      });
    },
  });

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle>Modification d'un utilisateur</CardTitle>

          <CardDescription>
            Remplissez le formulaire pour modifier l'utilisateur
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.AppField
              name="name"
              children={(field) => (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={field.name}>Nom</Label>

                  <field.Input type="text" placeholder="John Doe" />

                  {field.state.meta.errors.length ? (
                    <p className="text-destructive text-xs font-medium">
                      {field.state.meta.errors.map((error) => error?.message).join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <form.AppField
              name="email"
              children={(field) => (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={field.name}>Email</Label>

                  <field.Input type="email" placeholder="example@email.com" />

                  {field.state.meta.errors.length ? (
                    <p className="text-destructive text-xs font-medium">
                      {field.state.meta.errors.map((error) => error?.message).join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <form.AppField
              name="password"
              children={(field) => (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={field.name}>Mot de passe</Label>

                  <field.Input type="password" placeholder="********" />

                  {field.state.meta.errors.length ? (
                    <p className="text-destructive text-xs font-medium">
                      {field.state.meta.errors.map((error) => error?.message).join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <form.Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Connexion en cours..." : "Connexion"}
                </form.Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

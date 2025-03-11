import { z } from "zod";
import { Link, useRouter } from "@tanstack/react-router";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import authClient from "~/lib/utils/auth-client";

import { toast } from "sonner";
import { SignInButton } from "~/lib/components/SignInButton";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "~/lib/components/ui/label";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "~/lib/components/ui/card";

const REDIRECT_URL = "/dashboard";

const formSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
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

export function SignUpForm() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(value, {
        onRequest: () => {
          toast.info("Inscription en cours...");
        },
        onSuccess: () => {
          toast.success("Inscription réussie");
          router.navigate({ to: REDIRECT_URL });
        },
        onError: (error) => {
          console.error({ error });

          toast.error("Une erreur est survenue lors de l'inscription :", {
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
          <CardTitle>Inscription</CardTitle>

          <CardDescription>Remplissez le formulaire pour vous inscrire</CardDescription>
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

                  <field.Input placeholder="John Doe" />

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

            <form.AppField
              name="confirmPassword"
              children={(field) => (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={field.name}>Confirmation du mot de passe</Label>

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
                  {isSubmitting ? "Inscription en cours..." : "Inscription"}
                </form.Button>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              {["google", "github", "microsoft", "discord"].map((provider) => (
                <SignInButton
                  key={provider}
                  provider={provider as "google" | "github" | "microsoft" | "discord"}
                  REDIRECT_URL={REDIRECT_URL}
                />
              ))}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <CardDescription>
            Vous avez déjà un compte ?{" "}
            <Link to="/signin" className="text-primary font-medium hover:underline">
              Connexion
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}

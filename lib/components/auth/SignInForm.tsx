import { z } from "zod";
import { Link, useRouter } from "@tanstack/react-router";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import authClient from "~/lib/utils/auth-client";

import { toast } from "sonner";
import { SignInButton } from "~/lib/components/auth/SignInButton";

import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "~/lib/components/ui/card";

const REDIRECT_URL = "/dashboard";

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
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

export function SignInForm() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(value, {
        onRequest: () => {
          toast.info("Connexion en cours...");
        },
        onSuccess: () => {
          toast.success("Connexion réussie");
          router.navigate({ to: REDIRECT_URL });
        },
        onError: (error) => {
          console.error({ error });

          toast.error("Une erreur est survenue lors de la connexion :", {
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
          <CardTitle>Connexion</CardTitle>

          <CardDescription>Remplissez le formulaire pour vous connecter</CardDescription>
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
            Vous n'avez pas de compte ?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Créer un compte
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}

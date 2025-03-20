import { Link } from "@tanstack/react-router";

import authClient from "~/lib/utils/auth-client";
import { SignInButton } from "~/lib/components/auth/SignInButton";

import { toast } from "sonner";
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

export function SignInForm() {
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
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              const email = formData.get("email") as string;
              const password = formData.get("password") as string;

              // Basic validation
              if (!email || !email.includes("@")) {
                toast.error("Adresse email invalide");
                return;
              }

              if (!password || password.length < 8) {
                toast.error("Le mot de passe doit contenir au moins 8 caractères");
                return;
              }

              await authClient.signIn.email(
                { email, password, callbackURL: REDIRECT_URL },
                {
                  onRequest: () => {
                    toast.info("Connexion en cours...");
                  },
                  onSuccess: () => {
                    toast.success("Connexion réussie");
                  },
                  onError: (error) => {
                    console.error({ error });

                    toast.error("Une erreur est survenue lors de la connexion :", {
                      description: error.error.message,
                    });
                  },
                },
              );
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
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

            <Button type="submit" className="w-full">
              Connexion
            </Button>

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

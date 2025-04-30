import { useState } from "react";

import { Link } from "@tanstack/react-router";

import authClient from "~/lib/utils/auth-client";
import { SignInButton } from "~/components/auth/SignInButton";

import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { BorderBeam } from "~/components/ui/border-beam";
import { AnimatedButton } from "~/components/ui/state-button";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "~/components/ui/card";

const REDIRECT_URL = "/dashboard";

export function SignInForm() {
  const [buttonState, setButtonState] = useState<"idle" | "loading">("idle");

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !email.includes("@")) {
      toast.error("Adresse email invalide");
      return false;
    }

    if (!password || password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }

    await authClient.signIn.email(
      { email, password, callbackURL: REDIRECT_URL },
      {
        onRequest: () => {
          setButtonState("loading");
          toast.info("Connexion en cours...");
        },
        onError: (error) => {
          console.error({ error });
          toast.error("Une erreur est survenue :", {
            description: error.error.message,
          });
        },
        onResponse: () => {
          setButtonState("idle");
        },
      },
    );
  };

  return (
    <Card className="relative min-w-sm border-none">
      <BorderBeam
        duration={12}
        size={200}
        className="via-muted-foreground/40 from-transparent to-transparent"
      />

      <CardHeader>
        <CardTitle>Connexion</CardTitle>

        <CardDescription>Remplissez le formulaire pour vous connecter</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.target as HTMLFormElement);
            handleSubmit(formData);
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

          {/* <Button type="submit" className="w-full">
            Connexion
          </Button> */}

          <AnimatedButton
            className="w-full"
            idleText="Connexion"
            loadingText="Connexion en cours..."
            successText="Connexion réussie"
            errorText="Une erreur est survenue lors de la connexion"
            type="submit"
            state={buttonState}
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
  );
}

import { Link, useRouter } from "@tanstack/react-router";

import authClient from "~/lib/utils/auth-client";
import { SignInButton } from "~/components/auth/SignInButton";

import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { BorderBeam } from "~/components/ui/border-beam";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "~/components/ui/card";
const REDIRECT_URL = "/dashboard";

export function SignUpForm() {
  const router = useRouter();

  return (
    <Card className="relative min-w-sm border-dashed">
      <BorderBeam
        duration={12}
        size={200}
        className="via-muted-foreground/40 from-transparent to-transparent"
      />
      <CardHeader>
        <CardTitle>Inscription</CardTitle>

        <CardDescription>Remplissez le formulaire pour vous inscrire</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);

            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const confirmPassword = formData.get("confirmPassword") as string;

            // Basic validation
            if (!name || name.length < 2) {
              toast.error("Le nom doit contenir au moins 2 caractères");
              return;
            }

            if (!email || !email.includes("@")) {
              toast.error("Adresse email invalide");
              return;
            }

            if (!password || password.length < 8) {
              toast.error("Le mot de passe doit contenir au moins 8 caractères");
              return;
            }

            if (password !== confirmPassword) {
              toast.error("Les mots de passe ne correspondent pas");
              return;
            }

            await authClient.signUp.email(
              { name, email, password },
              {
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
              },
            );
          }}
        >
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirmation du mot de passe</Label>

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="********"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Inscription
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
          Vous avez déjà un compte ?{" "}
          <Link to="/signin" className="text-primary font-medium hover:underline">
            Connexion
          </Link>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}

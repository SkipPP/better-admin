import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

import { createUser } from "~/server/admin";

import { toast } from "sonner";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Button } from "~/lib/components/ui/button";
import {
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "~/lib/components/ui/card";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "~/lib/components/ui/select";

export const Route = createFileRoute("/dashboard/users/add/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <CardHeader className="px-0">
        <CardTitle>Ajouter un utilisateur</CardTitle>

        <CardDescription>
          Créez un nouvel utilisateur en renseignant les informations ci-dessous.
        </CardDescription>
      </CardHeader>

      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);

          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          const name = formData.get("name") as string;
          const role = formData.get("role") as string;

          // Basic validation
          if (!email || !email.includes("@")) {
            toast.error("Invalid email address");
            return;
          }

          if (!password || password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
          }

          if (!name) {
            toast.error("Name is required");
            return;
          }

          if (!role) {
            toast.error("Role is required");
            return;
          }

          await createUser({ data: formData })
            .then(() => {
              toast.success("User created successfully");
              router.navigate({ to: "/dashboard/users" });
            })
            .catch((error) => {
              toast.error("An error occurred while creating the user", {
                description: error.message,
              });
            });
        }}
      >
        <CardContent className="grid grid-cols-1 gap-4 px-0 md:grid-cols-2 xl:grid-cols-4">
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
        </CardContent>

        <CardFooter className="flex justify-between px-0">
          <Button asChild variant="outline">
            <Link to="/dashboard/users">Annuler</Link>
          </Button>

          <Button type="submit">Créer</Button>
        </CardFooter>
      </form>
    </div>
  );
}

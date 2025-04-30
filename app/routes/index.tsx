import { Link, createFileRoute, useRouter } from "@tanstack/react-router";

import authClient from "~/lib/utils/auth-client";

import { Button } from "~/components/ui/button";
import ThemeToggle from "~/components/layout/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Home() {
  const router = useRouter();
  const { user } = Route.useLoaderData();

  return (
    <div id="wave" className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">TanStarter</h1>
      <div className="flex items-center gap-2">
        This is an unprotected page:
        <pre className="bg-card text-card-foreground rounded-md border p-1">
          routes/index.tsx
        </pre>
      </div>

      {user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {user.name}!</p>

          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/dashboard" reloadDocument>
              Go to Dashboard
            </Link>
          </Button>

          <div>
            More data:
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>

          <Button
            onClick={async () => {
              await authClient.signOut();
              await router.invalidate();
            }}
            type="button"
            className="w-fit"
            variant="destructive"
            size="lg"
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p>You are not signed in.</p>
          
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/signin">Sign in</Link>
          </Button>
        </div>
      )}

      <ThemeToggle />
    </div>
  );
}

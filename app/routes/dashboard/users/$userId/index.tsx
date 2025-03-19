import { z } from "zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { listUserSessions, readUser, revokeAllUserSessions } from "~/server/admin";

import { Button } from "~/lib/components/ui/button";
import { columns, filters } from "~/lib/constants/sessions";
import { DataTable } from "~/lib/components/table/DataTable";

import { toast } from "sonner";
import { Trash } from "lucide-react";

export const Route = createFileRoute("/dashboard/users/$userId/")({
  component: RouteComponent,
  validateSearch: z.object({
    username: z.string().optional(),
    limit: z.number().default(10).optional(),
    currentPage: z.number().default(0).optional(),
  }),
  loaderDeps: ({ search }) => ({
    limit: search.limit,
    currentPage: search.currentPage,
  }),
  loader: async ({ params, deps }) => {
    const [user, userSessions] = await Promise.all([
      readUser({ data: { userId: params.userId } }),
      listUserSessions({
        data: {
          userId: params.userId,
          limit: deps.limit ?? 10,
          currentPage: deps.currentPage ?? 0,
        },
      }),
    ]);

    return { user: user.user, userSessions };
  },
});

function RouteComponent() {
  const router = useRouter();

  const { user, userSessions } = Route.useLoaderData();

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Sessions</h1>

          <div className="text-muted-foreground text-sm">
            Liste des sessions de l'utilisateur avec actions disponibles.
          </div>
        </div>

        <Button
          variant="secondary"
          className="cursor-pointer"
          onClick={async () => {
            await revokeAllUserSessions({ data: { userId: user.id } })
              .then(() => {
                toast.success("Toutes les sessions ont été révoquées avec succès");

                router.invalidate();
              })
              .catch((error) => {
                toast.error("Une erreur est survenue :", {
                  description: error.message,
                });
              });
          }}
        >
          <Trash className="mr-1 h-4 w-4" /> Révoquer les sessions
        </Button>
      </div>

      <DataTable
        search={false}
        columns={columns}
        data={userSessions.sessions}
        filters={filters}
      />
    </div>
  );
}

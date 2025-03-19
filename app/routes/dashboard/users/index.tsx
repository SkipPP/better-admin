import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { fetchUsers } from "~/server/admin";

import { columns, filters } from "~/lib/constants/users";
import { DataTable } from "~/lib/components/table/DataTable";

import AddUserDialog from "~/lib/components/AddUserDialog";

export const Route = createFileRoute("/dashboard/users/")({
  component: RouteComponent,
  validateSearch: z.object({
    limit: z.number().default(10).optional(),
    currentPage: z.number().default(0).optional(),
  }),
  loaderDeps: ({ search }) => ({
    limit: search.limit,
    currentPage: search.currentPage,
  }),
  loader: async ({ deps }) => {
    const { users, total } = await fetchUsers({
      data: { limit: deps.limit ?? 10, currentPage: deps.currentPage ?? 0 },
    });

    return { users, total };
  },
});

function RouteComponent() {
  const { users } = Route.useLoaderData();

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Utilisateurs</h1>

          <div className="text-muted-foreground text-sm">
            Liste des utilisateurs avec actions disponibles.
          </div>
        </div>

        <AddUserDialog />
      </div>

      <DataTable data={users} columns={columns} filters={filters} />
    </div>
  );
}

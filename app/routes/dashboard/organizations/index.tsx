import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { fetchOrganizations } from "~/server/organizations";

import { columns } from "~/lib/constants/organizations";
import { DataTable } from "~/lib/components/table/DataTable";

import AddOrganizationDialog from "~/lib/components/AddOrganizationDialog";

export const Route = createFileRoute("/dashboard/organizations/")({
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
    const { organizations } = await fetchOrganizations({
      data: { limit: deps.limit ?? 10, currentPage: deps.currentPage ?? 0 },
    });

    return { organizations };
  },
});

function RouteComponent() {
  const { organizations } = Route.useLoaderData();

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Organisations</h1>

          <div className="text-muted-foreground text-sm">
            Liste des organisations avec actions disponibles.
          </div>
        </div>

        <AddOrganizationDialog />
      </div>

      <DataTable data={organizations} columns={columns} />
    </div>
  );
}

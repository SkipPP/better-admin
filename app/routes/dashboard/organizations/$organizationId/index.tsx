import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { readOrganization } from "~/server/organizations";

import { Button } from "~/lib/components/ui/button";

import { DataTable } from "~/lib/components/table/DataTable";
import { organizationMembersColumns, filters } from "~/lib/constants/organizations";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";

import { Edit, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/organizations/$organizationId/")({
  component: RouteComponent,
  validateSearch: z.object({
    organizationName: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({
    organizationName: search.organizationName,
  }),
  loader: async ({ params }) => {
    const { organization } = await readOrganization({
      data: { id: params.organizationId },
    });

    return { organization };
  },
});

function RouteComponent() {
  const { organization } = Route.useLoaderData();

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Membres de l'organisation</h1>

          <div className="text-muted-foreground text-sm">
            Liste des membres de l'organisation <strong>{organization?.name}</strong>.
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="cursor-pointer">
              <Edit className="mr-1 h-4 w-4" /> Mettre à jour
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              <Edit className="mr-1 h-4 w-4" /> Modifier
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              <Plus className="mr-1 h-4 w-4" /> Ajouter des utilisateurs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable
        columns={organizationMembersColumns}
        data={organization?.members ?? []}
        filters={filters}
      />
    </div>
  );
}

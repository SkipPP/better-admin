import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";

import { DataTable } from "~/components/table/DataTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { DataTableRowOrganizationsActions } from "~/components/organizations/OrganizationsActions";
import {
  filters,
  organizationTeamsColumns,
  organizationMembersColumns,
} from "~/lib/constants/organizations";

import { Edit, UserIcon, Users } from "lucide-react";

export const Route = createFileRoute(
  "/dashboard/(administration)/organizations/$organizationId/",
)({
  component: RouteComponent,
  validateSearch: z.object({
    organizationName: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({
    organizationName: search.organizationName,
  }),
  loader: async ({ context: { user }, params }) => {
    const organization = user?.organizations.find(
      (organization) => organization.id === params.organizationId,
    );

    return { organization };
  },
});

function RouteComponent() {
  const { organization } = Route.useLoaderData();

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">{organization?.name}</h1>

          <div className="text-muted-foreground text-sm">
            Créée le{" "}
            <p className="inline font-medium">
              {organization?.createdAt?.toLocaleDateString("fr-FR")}
            </p>
            .
          </div>
        </div>

        <DataTableRowOrganizationsActions organization={organization}>
          <Button variant="dashed" className="cursor-pointer">
            <Edit className="mr-1 h-4 w-4" /> Mettre à jour
          </Button>
        </DataTableRowOrganizationsActions>
      </div>

      <Tabs defaultValue="members" className="gap-4">
        <TabsList className="bg-background gap-x-2 border border-dashed">
          <TabsTrigger value="members" className="cursor-pointer">
            <UserIcon className="h-4 w-4" /> Membres
          </TabsTrigger>

          <TabsTrigger value="teams" className="cursor-pointer">
            <Users className="h-4 w-4" /> Équipes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <DataTable
            search={true}
            columns={organizationMembersColumns}
            data={organization?.members ?? []}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="teams">
          <DataTable
            search={true}
            columns={organizationTeamsColumns}
            data={organization?.teams ?? []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

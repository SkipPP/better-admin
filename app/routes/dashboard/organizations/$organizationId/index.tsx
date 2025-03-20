import { z } from "zod";
import { createFileRoute, Link } from "@tanstack/react-router";

import { readOrganization } from "~/server/organizations";

import { Button } from "~/lib/components/ui/button";

import { DataTable } from "~/lib/components/table/DataTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/lib/components/ui/tabs";
import { DataTableRowOrganizationsActions } from "~/lib/components/RowOrganizationsActions";
import {
  filters,
  organizationTeamsColumns,
  organizationMembersColumns,
} from "~/lib/constants/organizations";

import { Edit, UserIcon, Users } from "lucide-react";

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
      data: { organizationId: params.organizationId },
    });

    return { organization };
  },
});

function RouteComponent() {
  const { organization } = Route.useLoaderData();

  const owner = organization?.members.find((member) => member.role === "owner");

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
            , par{" "}
            <Link
              to="/dashboard/administration/users/$userId"
              params={{ userId: owner?.userId ?? "" }}
              search={{ limit: 10, currentPage: 0, username: owner?.user.name }}
              className="text-muted-foreground font-medium hover:underline"
            >
              {owner?.user.name}
            </Link>
            .
          </div>
        </div>

        <DataTableRowOrganizationsActions organization={organization}>
          <Button variant="secondary" className="cursor-pointer">
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
            columns={organizationMembersColumns(organization)}
            data={organization?.members ?? []}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="teams">
          <DataTable
            search={true}
            columns={organizationTeamsColumns}
            data={organization?.teams ?? []}
            filters={filters}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

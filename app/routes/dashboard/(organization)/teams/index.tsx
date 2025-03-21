import { createFileRoute } from "@tanstack/react-router";

import { DataTable } from "~/lib/components/table/DataTable";
import { organizationTeamsColumns } from "~/lib/constants/organizations";

export const Route = createFileRoute("/dashboard/(organization)/teams/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return { organization: context.activeOrganization };
  },
});

function RouteComponent() {
  const { organization } = Route.useLoaderData();

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">
            {organization
              ? `Équipes de l'organisation : ${organization.name.charAt(0).toUpperCase() + organization.name.slice(1)}`
              : "Équipes de l'organisation"}
          </h1>

          <div className="text-muted-foreground text-sm">
            Créée le{" "}
            <p className="inline font-medium">
              {organization?.createdAt?.toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>

      <DataTable
        search={true}
        columns={organizationTeamsColumns}
        data={organization?.teams ?? []}
      />
    </div>
  );
}

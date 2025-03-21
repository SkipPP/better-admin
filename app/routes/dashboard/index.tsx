import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { readOrganization } from "~/server/organizations";

import { Edit, Loader2 } from "lucide-react";

import { Button } from "~/lib/components/ui/button";
import { AreaChart } from "~/lib/components/charts/AreaChart";
import { DataTableRowOrganizationsActions } from "~/lib/components/RowOrganizationsActions";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.activeOrganization) {
      const data = await readOrganization({
        data: { organizationId: context.activeOrganization.id },
      });

      return { organization: data.organization };
    }

    return { organization: context.activeOrganization };
  },
});

function RouteComponent() {
  const { organization } = Route.useLoaderData();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="col-span-1 flex items-center justify-between lg:col-span-2">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">
            {organization
              ? organization.name.charAt(0).toUpperCase() + organization.name.slice(1)
              : "Organisation"}
          </h1>

          <div className="text-muted-foreground text-sm">
            Créée le{" "}
            <p className="inline font-medium">
              {organization?.createdAt?.toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <DataTableRowOrganizationsActions organization={organization}>
          <Button variant="dashed" className="cursor-pointer">
            <Edit className="mr-1 h-4 w-4" /> Éditer
          </Button>
        </DataTableRowOrganizationsActions>
      </div>

      <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
        <AreaChart />
      </Suspense>
    </div>
  );
}

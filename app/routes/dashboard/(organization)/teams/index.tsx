import { createFileRoute } from "@tanstack/react-router";

import { DataTable } from "~/components/table/DataTable";
import { organizationTeamsColumns } from "~/lib/constants/organizations";

import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { FormTeamsDialog } from "~/components/organizations/teams/FormTeamsDialog";

export const Route = createFileRoute("/dashboard/(organization)/teams/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return { organization: context.user?.activeOrganization };
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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="dashed" className="cursor-pointer">
              <Plus className="mr-1 h-4 w-4" /> Ajouter une équipe
            </Button>
          </DialogTrigger>

          <DialogContent>
            <FormTeamsDialog add organizationId={organization?.id} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        search={true}
        columns={organizationTeamsColumns}
        data={organization?.teams ?? []}
      />
    </div>
  );
}

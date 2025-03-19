import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { readOrganization } from "~/server/organizations";

import { Button } from "~/lib/components/ui/button";

import { Edit } from "lucide-react";

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
          <h1 className="text-2xl font-bold">Détails de l'organisation</h1>

          <div className="text-muted-foreground text-sm">
            Détails de l'organisation <strong>{organization?.name}</strong>.
          </div>
        </div>

        <Button disabled variant="secondary" className="cursor-pointer">
          <Edit className="mr-1 h-4 w-4" /> Mettre à jour
        </Button>
      </div>

      <pre className="font-mono">{JSON.stringify(organization, null, 2)}</pre>
    </div>
  );
}

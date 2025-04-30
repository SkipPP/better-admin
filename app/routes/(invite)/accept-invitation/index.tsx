import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { getInvitationById } from "~/server/organizations";

import { OrganizationInvitation } from "~/components/AcceptInvitation";

export const Route = createFileRoute("/(invite)/accept-invitation/")({
  component: RouteComponent,
  validateSearch: z.object({
    invitationId: z.string().default(""),
  }),
  loaderDeps: ({ search }) => ({
    invitationId: search.invitationId,
  }),
  loader: async ({ deps }) => {
    const invitation = await getInvitationById({
      data: {
        invitationId: deps.invitationId,
      },
    });

    return { invitation };
  },
});

function RouteComponent() {
  const { invitation } = Route.useLoaderData();

  if (!invitation) {
    return <div>Invitation not found</div>;
  }

  return <OrganizationInvitation invitation={invitation} />;
}

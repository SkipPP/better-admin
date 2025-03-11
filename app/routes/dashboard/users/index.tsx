import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import authClient from "~/lib/utils/auth-client";

import { DataTable } from "~/lib/components/DataTable";

import { columns } from "../../../../lib/components/userColumns";

export const Route = createFileRoute("/dashboard/users/")({
  component: RouteComponent,
  validateSearch: z.object({
    limit: z.number(),
  }),
  loaderDeps: ({ search }) => ({
    limit: search.limit,
  }),
  loader: async ({ context, deps }) => {
    const users = await authClient.admin.listUsers({
      query: {
        limit: deps.limit,
      },
    });

    if (users.error) {
      console.error(users.error);

      throw new Error(`${users.error.status} ${users.error.statusText}`);
    }

    return { users: users.data };
  },
});

function RouteComponent() {
  const { users } = Route.useLoaderData();

  return <DataTable data={users.users} columns={columns} />;
}

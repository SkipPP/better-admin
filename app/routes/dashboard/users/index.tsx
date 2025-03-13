import { z } from "zod";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "~/lib/server/auth";
import authClient from "~/lib/utils/auth-client";

import { DataTable } from "~/lib/components/DataTable";

import { columns } from "../../../../lib/components/userColumns";

const listUsers = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const users = await auth.api.listUsers({ headers, query: { limit: 10 } });

  return { users: users.users, total: users.total };
});

const listUsersQuery = queryOptions({
  queryKey: ["users"],
  queryFn: ({ signal }) => listUsers({ signal }),
});

export const Route = createFileRoute("/dashboard/users/")({
  component: RouteComponent,
  validateSearch: z.object({
    limit: z.number(),
  }),
  loaderDeps: ({ search }) => ({
    limit: search.limit,
  }),
  loader: async ({ context, deps }) => {
    const users = await context.queryClient.fetchQuery(listUsersQuery);

    return users;
  },
});

function RouteComponent() {
  const { users } = Route.useLoaderData();

  return <DataTable data={users} columns={columns} />;
}

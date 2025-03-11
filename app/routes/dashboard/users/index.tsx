import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { createFileRoute } from "@tanstack/react-router";

import { User } from "better-auth";
import authClient from "~/lib/utils/auth-client";

import { DataTable } from "~/lib/components/DataTable";
import { DataTableColumnHeader } from "~/lib/components/DataTableColumnHeader";

export const Route = createFileRoute("/dashboard/users/")({
  component: RouteComponent,
  validateSearch: z.object({
    limit: z.number(),
  }),
  loaderDeps: ({ search }) => ({
    limit: search.limit,
  }),
  loader: async ({ deps }) => {
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

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    accessorKey: "banned",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Banned" />,
  },
  {
    accessorKey: "ban_reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banned Reason" />
    ),
  },
  {
    accessorKey: "ban_expires",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banned Until" />
    ),
  },
];

function RouteComponent() {
  const { users } = Route.useLoaderData();

  return <DataTable data={users.users} columns={columns} />;
}

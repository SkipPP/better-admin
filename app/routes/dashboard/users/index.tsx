import { z } from "zod";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";

import { deleteUser, fetchUsers } from "~/lib/server/admin";

import { DataTable } from "~/lib/components/table/DataTable";
import { columns } from "../../../../lib/constants/userColumns";

import { CircleAlert, ShieldAlert, User, UserCheck } from "lucide-react";
import { toast } from "sonner";

const filters = [
  {
    name: "role",
    title: "Rôle",
    options: [
      {
        label: "Administrateur",
        value: "admin",
        icon: UserCheck,
      },
      {
        label: "Utilisateur",
        value: "user",
        icon: User,
      },
    ],
  },
  {
    name: "ban_reason",
    title: "Motif de bannissement",
    options: [
      { value: "spam", label: "Spam", icon: ShieldAlert },
      { value: "abuse", label: "Abuse", icon: CircleAlert },
    ],
  },
];

function listUsers(limit?: number, currentPage?: number) {
  return queryOptions({
    queryKey: ["users", limit, currentPage],
    queryFn: ({ signal }) =>
      fetchUsers({ signal, data: { limit: limit ?? 10, currentPage: currentPage ?? 0 } }),
  });
}

export const Route = createFileRoute("/dashboard/users/")({
  component: RouteComponent,
  validateSearch: z.object({
    limit: z.number().default(10).optional(),
    currentPage: z.number().default(0).optional(),
  }),
  loaderDeps: ({ search }) => ({
    limit: search.limit,
    currentPage: search.currentPage,
  }),
  loader: async ({ context, deps }) => {
    const users = await context.queryClient.fetchQuery(
      listUsers(deps.limit, deps.currentPage),
    );

    return users;
  },
});

function RouteComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const { users } = Route.useLoaderData();

  return (
    <div className="relative">
      <DataTable
        data={users}
        columns={columns(
          (user) =>
            navigate({
              to: "/dashboard/users/$userId/edit",
              params: { userId: user.id },
              search: { username: user.name },
            }),
          (user) => {
            deleteUser({ data: { userId: user.id } });

            toast.success("Utilisateur supprimé avec succès");
            router.invalidate();
          },
        )}
        filters={filters}
        onRowClick={(row) =>
          navigate({
            to: "/dashboard/users/$userId",
            params: { userId: row.id },
            search: { username: row.name },
          })
        }
      />
    </div>
  );
}

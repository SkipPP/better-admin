import { z } from "zod";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";

import { UserWithRole } from "better-auth/plugins/admin";
import { deleteUser, fetchUsers } from "~/lib/server/admin";

import { columns, filters } from "~/lib/constants/users";
import { DataTable } from "~/lib/components/table/DataTable";

import { toast } from "sonner";

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
    const { users, total } = await context.queryClient.fetchQuery(
      listUsers(deps.limit, deps.currentPage),
    );

    return { users, total };
  },
});

function RouteComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const { users } = Route.useLoaderData();

  const handleDeleteUser = (user: UserWithRole) => {
    deleteUser({ data: { userId: user.id } })
      .then(() => {
        toast.success("Utilisateur supprimé avec succès");
        router.invalidate();
      })
      .catch((error) => {
        toast.error("Une erreur est survenue lors de la suppression de l'utilisateur :", {
          description: error.message,
        });
      });
  };

  const handleEditUser = (user: UserWithRole) => {
    navigate({
      to: "/dashboard/users/$userId/edit",
      params: { userId: user.id },
      search: { username: user.name },
    });
  };

  return (
    <div className="relative">
      <DataTable
        data={users}
        columns={columns(handleEditUser, handleDeleteUser)}
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

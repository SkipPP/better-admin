import { z } from "zod";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { readUser } from "~/lib/server/admin";

function readUserById(userId: string) {
  return queryOptions({
    queryKey: ["user", userId],
    queryFn: ({ signal }) => readUser({ signal, data: { userId } }),
  });
}

export const Route = createFileRoute("/dashboard/users/$userId/")({
  validateSearch: z.object({
    username: z.string(),
  }),
  loader: async ({ context, params }) => {
    const { user } = await context.queryClient.fetchQuery(readUserById(params.userId));

    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useLoaderData();

  return <div>Hello "{user.name}" !</div>;
}

import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { readUser } from "~/server/admin";

export const Route = createFileRoute("/dashboard/(administration)/users/$userId/edit/")({
  validateSearch: z.object({
    username: z.string(),
  }),
  loaderDeps: ({ search }) => ({
    username: search.username,
  }),
  loader: async ({ params }) => {
    const user = await readUser({ data: { userId: params.userId } });

    return user;
  },
  component: RouteComponent,
});

function RouteComponent() {
  // const { userId } = Route.useParams();

  const { user } = Route.useLoaderData();

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}

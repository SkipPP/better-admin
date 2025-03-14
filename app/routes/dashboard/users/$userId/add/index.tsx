import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users/$userId/add/")({
  validateSearch: z.object({
    username: z.string(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useSearch();

  return <div>you're gonna edit user {username}</div>;
}

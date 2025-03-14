import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users/$userId/")({
  validateSearch: z.object({
    username: z.string(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const { username } = Route.useSearch();

  return (
    <div>
      Hello "{username}" (id: {userId}) !
    </div>
  );
}

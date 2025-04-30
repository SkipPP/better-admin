import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { listOrganizationTasks } from "~/server/tasks";

import { Skeleton } from "~/components/ui/skeleton";
import KandanFull from "~/components/kandan/kanban-full";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/(organization)/tasks/")({
  component: RouteComponent,
  /* loader: async () => {
    const { tasks } = await listOrganizationTasks();

    return { tasks };
  }, */
});

function RouteComponent() {
  // const { tasks } = Route.useLoaderData();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => listOrganizationTasks(),
  });

  return (
    <div className="relative space-y-4">
      <div className="flex flex-col items-start">
        <h1 className="text-2xl font-bold">Tâches</h1>

        <span className="text-muted-foreground text-sm">
          Liste des tâches avec actions disponibles.
        </span>
      </div>

      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <KandanFull tasks={tasks?.tasks ?? []} />
      )}
    </div>
  );
}

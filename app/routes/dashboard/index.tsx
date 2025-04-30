import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">hi</div>;
}

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(administration)/organizations/$organizationId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(administration)/organizations/$organizationId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

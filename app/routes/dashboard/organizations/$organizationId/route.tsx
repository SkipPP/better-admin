import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/organizations/$organizationId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

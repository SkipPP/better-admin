import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/organizations")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

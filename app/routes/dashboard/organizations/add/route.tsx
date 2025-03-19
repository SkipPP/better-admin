import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/organizations/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

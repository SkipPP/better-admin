import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/administration/users/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

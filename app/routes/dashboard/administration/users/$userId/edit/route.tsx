import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/administration/users/$userId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

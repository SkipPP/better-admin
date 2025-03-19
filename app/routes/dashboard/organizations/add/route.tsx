import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users copy/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

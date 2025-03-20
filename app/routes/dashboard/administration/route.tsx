import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/administration")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

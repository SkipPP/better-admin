import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(administration)/organizations/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

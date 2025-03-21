import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(administration)/organizations")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(organization)/meetings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

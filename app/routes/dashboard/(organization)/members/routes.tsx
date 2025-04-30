import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(organization)/members/routes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(administration)/users")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

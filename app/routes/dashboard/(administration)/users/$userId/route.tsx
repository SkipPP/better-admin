import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(administration)/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

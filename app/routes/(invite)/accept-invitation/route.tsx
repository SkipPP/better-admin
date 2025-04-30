import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(invite)/accept-invitation")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Outlet />
    </div>
  );
}

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/(administration)/organizations")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.user?.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}

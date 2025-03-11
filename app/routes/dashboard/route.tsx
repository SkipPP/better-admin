import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

import { Breadcrumb } from "~/lib/components/Breadcrumb";
import { AppSidebar } from "~/lib/components/layout/Sidebar";

import ThemeToggle from "~/lib/components/ThemeToggle";
import { Separator } from "~/lib/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/lib/components/ui/sidebar";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }

    // `context.queryClient` is also available in our loaders
    // https://tanstack.com/start/latest/docs/framework/react/examples/start-basic-react-query
    // https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
  },
  loader: async ({ context }) => {
    return { user: context.user };
  },
});

function DashboardLayout() {
  const { user } = Route.useLoaderData();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex w-[inherit] items-center justify-between">
              <Breadcrumb />

              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "~/components/layout/Sidebar";
import { Breadcrumb } from "~/components/layout/Breadcrumb";

import { Separator } from "~/components/ui/separator";
import ThemeToggle from "~/components/layout/ThemeToggle";
import { SidebarInset, SidebarTrigger, SidebarProvider } from "~/components/ui/sidebar";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: async ({ context }) => {
    return {
      user: context.user,
    };
  },
});

function DashboardLayout() {
  const { user } = Route.useLoaderData();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden">
        <header className="bg-background flex h-14 shrink-0 items-center gap-2">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex w-[inherit] items-center justify-between">
              <Breadcrumb />

              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

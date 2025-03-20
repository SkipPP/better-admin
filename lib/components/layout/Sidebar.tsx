import * as React from "react";

import { Link, useRouter } from "@tanstack/react-router";

import { User } from "~/server/auth";
import authClient from "~/lib/utils/auth-client";

import { Building, Command, Plus, User as UserIcon } from "lucide-react";

import { NavUser } from "~/lib/components/layout/NavUser";
import { NavMain } from "~/lib/components/layout/NavMain";

import {
  Sidebar,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/lib/components/ui/sidebar";

const data = {
  admin: [
    {
      name: "Utilisateurs",
      url: "/dashboard/administration/users",
      icon: UserIcon,
      items: [
        {
          name: "Ajouter un utilisateur",
          url: "/dashboard/administration/users/add",
          icon: Plus,
        },
      ],
    },
    {
      name: "Organisations",
      url: "/dashboard/administration/organizations",
      icon: Building,
    },
  ],
  organizations: [
    {
      name: "Organisations",
      url: "/dashboard/organizations",
      search: {
        limit: 10,
        currentPage: 0,
      },
      icon: Building,
    },
    {
      name: "Ajouter une organisation",
      url: "/dashboard/organizations/add",
      icon: Plus,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const router = useRouter();

  return (
    <Sidebar className="z-50" variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">better admin</span>
                  <span className="truncate text-xs">components collection</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {user?.role === "admin" && <NavMain title="Administration" items={data.admin} />}

        <NavMain title="Mes organizations" items={data.organizations} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={user}
          onSignOut={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.navigate({ to: "/signin", reloadDocument: true });
                },
              },
            });
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

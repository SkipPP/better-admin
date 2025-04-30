import * as React from "react";

import { Link, useRouter } from "@tanstack/react-router";

import authClient from "~/lib/utils/auth-client";
import { UserWithOrganizations } from "~/server/users";

import {
  Building,
  Calendar,
  CircleCheckIcon,
  Command,
  Plus,
  User as UserIcon,
  Users,
} from "lucide-react";

import { NavUser } from "~/components/layout/NavUser";
import { NavMain } from "~/components/layout/NavMain";
import { OrganizationSwitcher } from "~/components/layout/OrganizationSwitcher";

import {
  Sidebar,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";

const data = {
  admin: [
    {
      name: "Utilisateurs",
      url: "/dashboard/users",
      search: {
        limit: 10,
        currentPage: 0,
      },
      icon: UserIcon,
      items: [
        {
          name: "Ajouter un utilisateur",
          url: "/dashboard/users/add",
          icon: Plus,
        },
      ],
    },
    {
      name: "Organisations",
      url: "/dashboard/organizations",
      search: {
        limit: 10,
        currentPage: 0,
      },
      icon: Building,
      items: [
        {
          name: "Ajouter une organisation",
          url: "/dashboard/organizations/add",
          icon: Plus,
        },
      ],
    },
  ],
  organization: [
    {
      name: "Membres",
      url: "/dashboard/members",
      icon: UserIcon,
      items: [
        {
          name: "Ajouter un membre",
          url: "/dashboard/members/add",
          icon: Plus,
        },
      ],
    },
    {
      name: "Équipes",
      url: "/dashboard/teams",
      icon: Users,
      items: [
        {
          name: "Ajouter une équipe",
          url: "/dashboard/teams/add",
          icon: Plus,
        },
      ],
    },
  ],
  organizationData: [
    {
      name: "Meetings",
      url: "/dashboard/meetings",
      icon: Calendar,
      items: [
        {
          name: "Ajouter une réunion",
          url: "/dashboard/meetings/add",
        },
      ],
    },
    {
      name: "Tasks",
      url: "/dashboard/tasks",
      icon: CircleCheckIcon,
      items: [
        {
          name: "Ajouter une tâche",
          url: "/dashboard/tasks/add",
        },
      ],
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserWithOrganizations;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const router = useRouter();

  const userRole = user?.role;

  return (
    <Sidebar className="z-50" variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        {userRole === "admin" ? (
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
        ) : (
          <OrganizationSwitcher user={user} />
        )}
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          title={userRole === "admin" ? "Administration" : "Mon organisation"}
          items={userRole === "admin" ? data.admin : data.organization}
        />

        <NavMain title="Organization" items={data.organizationData} />
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

import * as React from "react";

import { Link, useRouter } from "@tanstack/react-router";

import { User } from "better-auth";
import authClient from "~/lib/utils/auth-client";

import { Command, User as UserIcon, UserPlus, Ban } from "lucide-react";

import { NavUser } from "~/lib/components/layout/NavUser";
import { NavList } from "~/lib/components/layout/NavList";

import {
  Sidebar,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/lib/components/ui/sidebar";

const data = [
  {
    name: "Utilisateurs",
    url: "/dashboard/users",
    search: {
      limit: 10,
    },
    icon: UserIcon,
  },
  {
    name: "Ajouter un utilisateur",
    url: "/dashboard/users/add",
    icon: UserPlus,
  },
  {
    name: "Modérer un utilisateur",
    url: "/dashboard/users/moderate",
    icon: Ban,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const router = useRouter();

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
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
        <NavList items={data} />
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

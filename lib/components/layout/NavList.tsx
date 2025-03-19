import { Link } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "~/lib/components/ui/sidebar";

export function NavList({
  items,
}: {
  items: {
    name: string;
    url: string;
    search?: Record<string, string | number | Array<string | number>>;
    icon: LucideIcon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gestion des utilisateurs</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                to={item.url}
                search={item.search}
                activeProps={{
                  className: "bg-muted",
                }}
                activeOptions={{ exact: true, includeSearch: false }}
              >
                <item.icon />

                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

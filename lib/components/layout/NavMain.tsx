import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/lib/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/lib/components/ui/sidebar";

export function NavMain({
  items,
  title,
}: {
  items: {
    name: string;
    url: string;
    search?: Record<string, string | number | Array<string | number>>;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      name: string;
      url: string;
      search?: Record<string, string | number | Array<string | number>>;
    }[];
  }[];
  title?: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {title ? title.charAt(0).toUpperCase() + title.slice(1) : "Mon organisation"}
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.name} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.name}>
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

              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

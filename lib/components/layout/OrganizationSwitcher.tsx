import { useCallback } from "react";
import { useRouter } from "@tanstack/react-router";

import { UserWithOrganizations } from "~/server/users";
import { setActiveOrganization } from "~/server/organizations";

import { Check, ChevronsUpDown, Command } from "lucide-react";

import { toast } from "sonner";
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/lib/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";

interface OrganizationSwitcherProps {
  userData: {
    user: UserWithOrganizations["user"] | null;
    activeOrganization: UserWithOrganizations["activeOrganization"] | null;
    organizations: UserWithOrganizations["organizations"];
  };
}

export function OrganizationSwitcher({ userData }: OrganizationSwitcherProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleOrganizationSwitch = useCallback(
    async (organizationId: string) => {
      if (organizationId === userData.activeOrganization?.id) return;

      try {
        await setActiveOrganization({ data: { organizationId } }).then(() => {
          toast.info("Organisation active mise à jour");

          router.invalidate();
        });
      } catch (error) {
        toast.error("Une erreur est survenue :", {
          description: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    },
    [userData.activeOrganization?.id, router],
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userData.activeOrganization?.name}
                </span>
                <span className="truncate text-xs">
                  {userData.activeOrganization?.slug}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align={"start"}
            sideOffset={4}
          >
            {userData.organizations?.map((organization) => (
              <DropdownMenuItem
                key={organization.id}
                onSelect={() => handleOrganizationSwitch(organization.id)}
                disabled={organization.id === userData.activeOrganization?.id}
              >
                {organization.name}{" "}
                {organization.id === userData.activeOrganization?.id && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

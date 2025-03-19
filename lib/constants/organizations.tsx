import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { Organization, OrganizationMember } from "~/server/auth";

import { UserCheck, UserIcon } from "lucide-react";

import { Badge } from "~/lib/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { DataTableColumnHeader } from "~/lib/components/table/DataTableColumnHeader";

export const filters = [
  {
    name: "role",
    title: "Rôle",
    options: [
      {
        label: "Propriétaire",
        value: "owner",
        icon: UserCheck,
      },
      {
        label: "Administrateur",
        value: "admin",
        icon: UserCheck,
      },
      {
        label: "Membre",
        value: "member",
        icon: UserIcon,
      },
    ],
  },
];

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "logo",
    accessorFn: (row) => row.logo,
    meta: {
      label: "Avatar",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => {
      return (
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={row.getValue("logo")} alt={row.getValue("name")} />

          <AvatarFallback className="rounded-lg">
            {(row.getValue("name") as string).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "name",
    accessorFn: (row) => row.name,
    meta: {
      label: "Nom",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      return (
        <Link
          preload="intent"
          to="/dashboard/organizations/$organizationId"
          params={{ organizationId: row.original.id }}
          search={{
            organizationName: row.original.name,
          }}
          className="font-medium hover:underline"
        >
          {row.getValue("name")}
        </Link>
      );
    },
  },
  {
    accessorKey: "slug",
    accessorFn: (row) => row.slug,
    meta: {
      label: "Slug",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => {
      return <span>{row.getValue("slug")}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => row.createdAt,
    meta: {
      label: "Date de création",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const formattedCreatedAt = createdAt.toLocaleDateString("fr-FR");

      return <span>{formattedCreatedAt}</span>;
    },
  },
  {
    id: "actions",
    meta: {
      align: "right",
    },
    header: () => null,
    cell: () => <span>actions</span>,
  },
];

export const organizationMembersColumns: ColumnDef<OrganizationMember>[] = [
  {
    accessorKey: "image",
    accessorFn: (row) => row.user.image,
    meta: {
      label: "Avatar",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => {
      return (
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={row.original.user.image} alt={row.original.user.name} />

          <AvatarFallback className="rounded-lg">
            {row.original.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "name",
    accessorFn: (row) => row.user.name,
    meta: {
      label: "Utilisateur",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start">
          <Link
            preload="intent"
            to="/dashboard/users/$userId"
            params={{ userId: row.original.id }}
            search={{
              limit: 10,
              username: row.original.user.name,
            }}
            className="font-medium hover:underline"
          >
            {row.original.user.name}
          </Link>

          <a
            href={`mailto:${row.original.user.email}`}
            className="text-muted-foreground hover:underline"
          >
            {row.original.user.email}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => row.createdAt,
    meta: {
      label: "Date de création",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const formattedCreatedAt = createdAt?.toLocaleDateString("fr-FR");

      return <span>{formattedCreatedAt}</span>;
    },
  },
  {
    accessorKey: "role",
    accessorFn: (row) => row.role,
    meta: {
      label: "Rôle",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const role = filters[0].options.find((role) => role.value === row.getValue("role"));

      if (!role) {
        return null;
      }

      return (
        <Badge variant={role.value === "owner" ? "destructive" : "secondary"}>
          <role.icon className="mr-1 h-4 w-4" />
          {role.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

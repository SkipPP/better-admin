import { Organization } from "~/server/auth";
import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { DataTableColumnHeader } from "~/lib/components/table/DataTableColumnHeader";

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

import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins/admin";

import { Badge } from "~/components/ui/badge";
import { DataTableRowUsersActions } from "~/components/RowUsersActions";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { DataTableColumnHeader } from "~/components/table/DataTableColumnHeader";

import {
  UserCheck,
  CircleAlert,
  ShieldAlert,
  User as UserIcon,
  Shield,
} from "lucide-react";

export const filters = [
  {
    name: "role",
    title: "Rôle",
    options: [
      {
        label: "Administrateur",
        value: "admin",
        icon: UserCheck,
      },
      {
        label: "Utilisateur",
        value: "user",
        icon: UserIcon,
      },
    ],
  },
  {
    name: "banReason",
    title: "Motif de bannissement",
    options: [
      { value: "spam", label: "Spam", icon: ShieldAlert },
      { value: "abus", label: "Abus", icon: CircleAlert },
    ],
  },
];

export const columns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: "image",
    accessorFn: (row) => row.image,
    meta: {
      label: "Avatar",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => {
      return (
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={row.getValue("image")} alt={row.getValue("name")} />

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
              username: row.original.name,
            }}
            className="font-medium hover:underline"
          >
            {row.getValue("name")}
          </Link>

          <a
            href={`mailto:${row.original.email}`}
            className="text-muted-foreground hover:underline"
          >
            {row.original.email}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    accessorFn: (row) => row.emailVerified,
    meta: {
      label: "Email vérifié",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => {
      return <span>{row.getValue("emailVerified") ? "Oui" : "Non"}</span>;
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
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
        <Badge variant="secondary">
          <role.icon className="mr-1 h-4 w-4" />
          {role.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "banReason",
    accessorFn: (row) => row.banReason,
    meta: {
      label: "Banni",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => {
      if (!row.getValue("banReason")) {
        return <span className="text-muted-foreground italic">Aucun bannissement</span>;
      }

      const banExpires = new Date(row.original.banExpires ?? "");
      const today = new Date();

      // Calculate the difference in days
      const diffTime = banExpires.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Format the remaining days text
      const remainingDaysText = `${diffDays} jour${diffDays > 1 ? "s" : ""} restant${diffDays > 1 ? "s" : ""}`;

      return (
        <span className="inline">
          <Badge variant="outline">
            <Shield className="mr-1 h-4 w-4" />
            {(row.getValue("banReason") as string).toUpperCase()}
          </Badge>

          <span className="text-muted-foreground ml-1 text-xs italic">
            ({remainingDaysText})
          </span>
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    id: "actions",
    meta: {
      align: "right",
    },
    header: () => null,
    cell: ({ row }) => <DataTableRowUsersActions user={row.original} />,
  },
];

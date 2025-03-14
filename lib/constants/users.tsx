import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins/admin";

import {
  Circle,
  CircleAlert,
  ShieldAlert,
  HelpCircle,
  UserCheck,
  User as UserIcon,
} from "lucide-react";

import { DataTableRowActions } from "~/lib/components/table/DataTableRowActions";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { DataTableColumnHeader } from "~/lib/components/table/DataTableColumnHeader";

export const columns: (
  onEdit: (user: UserWithRole) => void,
  onDelete: (user: UserWithRole) => void,
) => ColumnDef<UserWithRole>[] = (onEdit, onDelete) => [
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
      label: "Nom",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      return <span>{row.getValue("name")}</span>;
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => row.email,
    meta: {
      label: "Email",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      return <span>{row.getValue("email")}</span>;
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
    accessorKey: "role",
    accessorFn: (row) => row.role,
    meta: {
      label: "Rôle",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const role = [
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
      ].find((role) => role.value === row.getValue("role"));

      if (!role) {
        return null;
      }

      return <span className="truncate font-medium">{role.label}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
    accessorKey: "banReason",
    accessorFn: (row) => row.banReason,
    meta: {
      label: "Motif de bannissement",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => {
      const banReason = [
        {
          value: "spam",
          label: "Spam",
          icon: HelpCircle,
        },
        {
          value: "abuse",
          label: "Abuse",
          icon: Circle,
        },
        {
          value: "other",
          label: "Other",
          icon: Circle,
        },
      ].find((banReason) => banReason.value === row.getValue("banReason"));

      if (!banReason) {
        return null;
      }

      return <span>{banReason.label}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    id: "actions",
    accessorFn: (row) => row.id,
    meta: {
      label: "Actions",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original)}
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
];

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
      { value: "abuse", label: "Abuse", icon: CircleAlert },
    ],
  },
];

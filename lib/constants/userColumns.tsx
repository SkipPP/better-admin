import { User } from "better-auth";
import { ColumnDef } from "@tanstack/react-table";

import { Circle, HelpCircle, UserCheck, User as UserIcon } from "lucide-react";

import { DataTableRowActions } from "~/lib/components/table/DataTableRowActions";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { DataTableColumnHeader } from "~/lib/components/table/DataTableColumnHeader";

export const columns: (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
) => ColumnDef<User>[] = (onEdit, onDelete) => [
  {
    accessorKey: "image",
    meta: {
      label: "Avatar",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" className="px-2.5" />
    ),
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
    meta: {
      label: "Nom",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <span>{row.getValue("name")}</span>;
    },
  },
  {
    accessorKey: "email",
    meta: {
      label: "Email",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return <span>{row.getValue("email")}</span>;
    },
  },
  {
    accessorKey: "email_verified",
    meta: {
      label: "Email vérifié",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email vérifié" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("email_verified") ? "Oui" : "Non"}</span>;
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "role",
    meta: {
      label: "Rôle",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
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
    meta: {
      label: "Date de création",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de création" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const formattedCreatedAt = createdAt.toLocaleDateString("fr-FR");

      return <span>{formattedCreatedAt}</span>;
    },
  },
  {
    accessorKey: "ban_reason",
    meta: {
      label: "Motif de bannissement",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motif de bannissement" />
    ),
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
      ].find((banReason) => banReason.value === row.getValue("ban_reason"));

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
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original)}
      />
    ),
  },
];

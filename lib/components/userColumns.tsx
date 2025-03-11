import { z } from "zod";

import { User } from "better-auth";
import { ColumnDef } from "@tanstack/react-table";

import { Circle, HelpCircle, UserCheck, User as UserIcon, UserPen } from "lucide-react";

import { Checkbox } from "~/lib/components/ui/checkbox";

import { DataTableRowActions } from "~/lib/components/DataTableRowActions";
import { DataTableColumnHeader } from "~/lib/components/DataTableColumnHeader";

export const taskSchema = z.object({
  id: z.string(),
  name: z.string(),
  ban_reason: z.string().optional(),
  role: z.string(),
  banned: z.boolean().nullable(),
});

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <span className="truncate font-medium">{row.getValue("name")}</span>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return <span className="truncate font-medium">{row.getValue("email")}</span>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = [
        {
          label: "Super Admin",
          value: "super_admin",
          icon: UserPen,
        },
        {
          label: "Administrator",
          value: "admin",
          icon: UserCheck,
        },
        {
          label: "User",
          value: "user",
          icon: UserIcon,
        },
      ].find((role) => role.value === row.getValue("role"));

      if (!role) {
        return null;
      }

      return <span>{role.label}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "ban_reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banned Reason" />
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
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

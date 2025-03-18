import { Session } from "better-auth";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../components/ui/badge";
import { DataTableColumnHeader } from "~/lib/components/table/DataTableColumnHeader";

import { SiFirefox, SiGooglechrome, SiSafari } from "@icons-pack/react-simple-icons";

export const filters = [
  {
    name: "userAgent",
    title: "User Agent",
    options: [
      {
        label: "Mozilla",
        value: "Mozilla",
        icon: SiFirefox,
      },
      {
        label: "Chrome",
        value: "Chrome",
        icon: SiGooglechrome,
      },
      {
        label: "Safari",
        value: "Safari",
        icon: SiSafari,
      },
    ],
  },
];

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "createdAt",
    accessorFn: (row) => row.createdAt,
    meta: {
      label: "Date de création",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const formattedCreatedAt = createdAt.toLocaleString("fr-FR");

      return <span>{formattedCreatedAt}</span>;
    },
  },
  {
    accessorKey: "expiresAt",
    accessorFn: (row) => row.expiresAt,
    meta: {
      label: "Date d'expiration",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const expiresAt = new Date(row.getValue("expiresAt"));
      const formattedExpiresAt = expiresAt.toLocaleString("fr-FR");

      return <span>{formattedExpiresAt}</span>;
    },
  },
  {
    accessorKey: "ipAddress",
    accessorFn: (row) => row.ipAddress,
    meta: {
      label: "Adresse IP",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} className="px-2.5" />,
    cell: ({ row }) => {
      return <span>{row.getValue("ipAddress")}</span>;
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "userAgent",
    accessorFn: (row) => row.userAgent,
    meta: {
      label: "User Agent",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      return <Badge>{(row.getValue("userAgent") as string).split("/")[0]}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes((row.getValue(id) as string).split("/")[0]);
    },
  },
  {
    accessorKey: "actions",
    meta: {
      align: "right",
    },
    header: () => null,
    cell: () => <span>actions</span>,
  },
];

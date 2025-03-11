import { Table } from "@tanstack/react-table";

import { Circle, X, HelpCircle, UserCheck, User, UserPen } from "lucide-react";

import { Input } from "~/lib/components/ui/input";
import { Button } from "~/lib/components/ui/button";

import { DataTableViewOptions } from "./DataTableColumnToggle";
import { DataTableFacetedFilter } from "~/lib/components/DataTableFilter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("ban_reason") && (
          <DataTableFacetedFilter
            column={table.getColumn("ban_reason")}
            title="Banned Reason"
            options={[
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
            ]}
          />
        )}

        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={[
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
                icon: User,
              },
            ]}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}

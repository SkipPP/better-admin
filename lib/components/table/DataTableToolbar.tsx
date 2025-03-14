"use no memo";

import { Table } from "@tanstack/react-table";

import { X } from "lucide-react";

import { Input } from "~/lib/components/ui/input";
import { Button } from "~/lib/components/ui/button";

import { DataTableViewOptions } from "./DataTableColumnToggle";
import { DataTableFacetedFilter } from "~/lib/components/table/DataTableFilter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: {
    name: string;
    title: string;
    options: {
      value: string;
      label: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="bg-background sticky top-16 z-10 flex items-center justify-between pb-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Rechercher un utilisateur..."
          className="bg-background w-[150px] lg:w-[250px]"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />

        {filters.map((filter) => {
          return (
            table.getColumn(filter.name) && (
              <DataTableFacetedFilter
                key={filter.name}
                title={filter.title}
                column={table.getColumn(filter.name)}
                options={filter.options}
              />
            )
          );
        })}

        {isFiltered && (
          <Button
            variant="secondary"
            className="h-8 cursor-pointer px-2 text-xs font-normal lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Réinitialiser
            <X />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}

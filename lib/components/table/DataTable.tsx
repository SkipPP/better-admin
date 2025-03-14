"use no memo";

import * as React from "react";

import { useLocation } from "@tanstack/react-router";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "~/lib/components/ui/table";

import { DataTableToolbar } from "~/lib/components/table/DataTableToolbar";
import { DataTablePagination } from "~/lib/components/table/DataTablePagination";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];

  onRowClick?: (row: TData) => void;

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

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const location = useLocation();

  // Memoize the columns to prevent unnecessary re-renders
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: location.search.currentPage ? location.search.currentPage : 0,
    pageSize: location.search.limit ? location.search.limit : 10,
  });

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <React.Fragment>
      <DataTableToolbar table={table} filters={filters} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="py-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  data-href={onRowClick && "href"}
                  className="data-[href]:cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (row.id !== "actions" && onRowClick) {
                      onRowClick(row.original);
                    } else if (row.getCanSelect()) {
                      row.getToggleSelectedHandler();
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </React.Fragment>
  );
}

"use no memo";

import { Table } from "@tanstack/react-table";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "~/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-3">
        <p className="text-sm">Lignes par page</p>

        <Select
          value={
            location.search.limit
              ? `${location.search.limit}`
              : `${table.getState().pagination.pageSize}`
          }
          onValueChange={(value) => {
            table.setPageSize(Number(value));

            navigate({
              to: location.pathname,
              search: (prev) => ({
                ...prev,
                limit: Number(value),
              }),
            });
          }}
        >
          <SelectTrigger className="h-8! w-[70px] shadow-none">
            <SelectValue
              placeholder={
                location.search.limit
                  ? `${location.search.limit}`
                  : `${table.getState().pagination.pageSize}`
              }
            />
          </SelectTrigger>

          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={`${pageSize}`}
                onClick={() => {
                  table.setPageSize(pageSize);
                }}
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-muted-foreground text-sm">
          {table.getFilteredRowModel().rows.length} ligne(s)
        </p>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        <p className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
        </p>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="hidden shadow-none lg:flex"
            onClick={() => {
              table.setPageIndex(0);

              navigate({
                to: location.pathname,
                search: (prev) => ({
                  ...prev,
                  currentPage: 0,
                }),
              });
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Aller à la première page</span>
            <ChevronsLeft /> First
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="shadow-none"
            onClick={() => {
              table.previousPage();

              navigate({
                to: location.pathname,
                search: (prev) => ({
                  ...prev,
                  currentPage: table.getState().pagination.pageIndex - 1,
                }),
              });
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Aller à la page précédente</span>
            <ChevronLeft /> Previous
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="shadow-none"
            onClick={() => {
              table.nextPage();

              navigate({
                to: location.pathname,
                search: (prev) => ({
                  ...prev,
                  currentPage: table.getState().pagination.pageIndex + 1,
                }),
              });
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Aller à la page suivante</span>
            <ChevronRight /> Next
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="hidden shadow-none lg:flex"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);

              navigate({
                to: location.pathname,
                search: (prev) => ({
                  ...prev,
                  currentPage: table.getPageCount() - 1,
                }),
              });
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Aller à la dernière page</span>
            <ChevronsRight /> Last
          </Button>
        </div>
      </div>
    </div>
  );
}

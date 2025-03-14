"use no memo";

import { Table } from "@tanstack/react-table";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "~/lib/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "~/lib/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} sur{" "}
        {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Lignes par page</p>

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
                search: { limit: Number(value) },
              });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
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
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
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
            <ChevronsLeft />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
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
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
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
            <ChevronRight />
          </Button>

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
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
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

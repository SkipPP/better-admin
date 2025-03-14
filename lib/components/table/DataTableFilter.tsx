"use no memo";

import * as React from "react";

import { Column } from "@tanstack/react-table";

import { Check, Settings2 } from "lucide-react";

import { cn } from "~/lib/utils";

import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import { Separator } from "~/lib/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "~/lib/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/lib/components/ui/command";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <Settings2 />

          {title}

          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4!" />

              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>

              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] border-dashed p-0" align="start">
        <Command>
          <CommandInput />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    className="gap-1"
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }

                      const filterValues = Array.from(selectedValues);

                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check />
                    </div>

                    <span>
                      {option.label}{" "}
                      {facets?.get(option.value) ? `(${facets.get(option.value)})` : null}
                    </span>

                    {option.icon && (
                      <option.icon className="text-muted-foreground ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />

                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Réinitialiser
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

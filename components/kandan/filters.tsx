import * as React from "react";

import { cn } from "~/lib/utils";

import { ListFilter } from "lucide-react";

import { Button } from "~/components/ui/button";
import Filters from "~/components/ui/filters";
import { AnimateChangeInHeight } from "~/components/ui/filters";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import {
  DueDate,
  Filter,
  FilterOperator,
  FilterOption,
  FilterType,
  filterViewOptions,
  filterViewToFilterOptions,
} from "~/components/ui/filters";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";

import { v4 as uuidv4 } from "uuid";

type KandanFiltersProps = {
  onFiltersChange: (filters: Filter[]) => void;
};

export function KandanFilters({ onFiltersChange }: KandanFiltersProps) {
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<Filter[]>([]);
  const [commandInput, setCommandInput] = React.useState("");
  const [selectedView, setSelectedView] = React.useState<FilterType | null>(null);

  const commandInputRef = React.useRef<HTMLInputElement>(null);

  // Update parent component when filters change
  React.useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  return (
    <div className="flex flex-wrap gap-2">
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open);

          if (!open) {
            setTimeout(() => {
              setSelectedView(null);
              setCommandInput("");
            }, 200);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="dashed"
            role="combobox"
            aria-expanded={open}
            size="sm"
            className={cn(
              "group flex items-center gap-1.5 rounded-sm text-xs transition",
              filters.length > 0 && "w-8",
            )}
          >
            <ListFilter className="text-muted-foreground group-hover:text-primary size-3 shrink-0 transition-all" />
            {!filters.length && "Filter"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <AnimateChangeInHeight>
            <Command>
              <CommandInput
                placeholder={selectedView ? selectedView : "Filter..."}
                className="h-9"
                value={commandInput}
                onInputCapture={(e) => {
                  setCommandInput(e.currentTarget.value);
                }}
                ref={commandInputRef}
              />

              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {selectedView ? (
                  <CommandGroup>
                    {filterViewToFilterOptions[selectedView].map(
                      (filter: FilterOption) => (
                        <CommandItem
                          className="group text-muted-foreground flex items-center gap-2"
                          key={filter.name}
                          value={filter.name}
                          onSelect={(currentValue) => {
                            setFilters((prev) => [
                              ...prev,
                              {
                                id: uuidv4(),
                                type: selectedView,
                                operator:
                                  selectedView === FilterType.DUE_DATE &&
                                  currentValue !== DueDate.IN_THE_PAST
                                    ? FilterOperator.BEFORE
                                    : FilterOperator.IS,
                                value: [currentValue],
                              },
                            ]);
                            setTimeout(() => {
                              setSelectedView(null);
                              setCommandInput("");
                            }, 200);
                            setOpen(false);
                          }}
                        >
                          {filter.icon}

                          <span className="text-accent-foreground">{filter.name}</span>

                          {filter.label && (
                            <span className="text-muted-foreground ml-auto text-xs">
                              {filter.label}
                            </span>
                          )}
                        </CommandItem>
                      ),
                    )}
                  </CommandGroup>
                ) : (
                  filterViewOptions.map((group: FilterOption[], index: number) => (
                    <React.Fragment key={index}>
                      <CommandGroup>
                        {group.map((filter: FilterOption) => (
                          <CommandItem
                            className="group text-muted-foreground flex items-center gap-2"
                            key={filter.name}
                            value={filter.name}
                            onSelect={(currentValue) => {
                              setSelectedView(currentValue as FilterType);
                              setCommandInput("");
                              commandInputRef.current?.focus();
                            }}
                          >
                            {filter.icon}

                            <span className="text-accent-foreground">{filter.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {index < filterViewOptions.length - 1 && <CommandSeparator />}
                    </React.Fragment>
                  ))
                )}
              </CommandList>
            </Command>
          </AnimateChangeInHeight>
        </PopoverContent>
      </Popover>

      <Filters filters={filters} setFilters={setFilters} />

      {filters.filter((filter) => filter.value?.length > 0).length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="group items-center rounded-sm text-xs shadow-none transition"
          onClick={() => {
            setFilters([]);
            onFiltersChange([]);
          }}
        >
          Clear
        </Button>
      )}
    </div>
  );
}

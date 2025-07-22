import { Column } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Filter, X } from "lucide-react";

interface ColumnHeaderFilterProps<TData, TValue> {
    column: Column<TData, TValue>
    title: string
    filterOptions?: { label: string, value: string }[]
}

export function ColumnHeaderFilter<TData, TValue>({
    column,
    title,
    filterOptions = [],
}: ColumnHeaderFilterProps<TData, TValue>) {

    const sortDirection = column.getIsSorted();
    const filterValue = column.getFilterValue() as string;
    const hasFilter = !!filterValue;
    const canSort = column.getCanSort();
    const canFilter = column.getCanFilter() && filterOptions.length > 0;

    // Custom filter function for array-based columns (regulations, hazards)
    const handleFilterChange = (checked: boolean, optionValue: string) => {
        if (checked) {
            column.setFilterValue(optionValue);
        } else {
            column.setFilterValue('');
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-8 data-[state=open]:bg-accent",
                            (hasFilter || sortDirection) && "bg-accent"
                        )}
                    >
                        <span>{title}</span>
                        {sortDirection === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                        ) : sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="h-4 w-4" />
                        )}
                        {hasFilter && <Filter className="h-3 w-3" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    {canSort && (
                        <>
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                                Sort
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => column.toggleSorting(false)}
                                className="text-xs"
                            >
                                <ArrowUp className="h-4 w-4" />
                                {title === 'Incident Date' ? 'Oldest First' : 'Ascending'}
                                {sortDirection === "asc" && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => column.toggleSorting(true)}
                                className="text-xs"
                            >
                                <ArrowDown className="h-4 w-4" />
                                {title === 'Incident Date' ? 'Newest First' : 'Descending'}
                                {sortDirection === "desc" && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                            {sortDirection && (
                                <DropdownMenuItem
                                    onClick={() => column.clearSorting()}
                                    className="text-xs"
                                >
                                    <X />
                                    Clear Sort
                                </DropdownMenuItem>
                            )}
                        </>
                    )}

                    {canSort && canFilter && <DropdownMenuSeparator />}

                    {canFilter && (
                        <>
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                                Filter
                            </DropdownMenuLabel>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="text-xs">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter by {title}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-56 max-h-64 overflow-y-auto">
                                    <DropdownMenuCheckboxItem
                                        checked={!filterValue}
                                        onCheckedChange={() => column.setFilterValue('')}
                                    >
                                        (All)
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuSeparator />
                                    {filterOptions.map((option) => (
                                        <DropdownMenuCheckboxItem
                                            key={option.value}
                                            checked={filterValue === option.value}
                                            onCheckedChange={(checked) => handleFilterChange(checked, option.value)}
                                        >
                                            <div className="truncate" title={option.value}>
                                                {option.label}
                                            </div>
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            {hasFilter && (
                                <DropdownMenuItem
                                    onClick={() => column.setFilterValue('')}
                                    className="text-xs"
                                >
                                    <X />
                                    Clear Filter
                                </DropdownMenuItem>
                            )}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
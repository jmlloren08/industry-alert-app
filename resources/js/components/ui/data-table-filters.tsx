import { Table } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button } from "./button";
import { X } from "lucide-react";

interface DataTableFiltersProps<TData> {
    table: Table<TData>
    filterOptions: Record<string, { label: string, value: string }[]>
}

export function DataTableFilters<TData>({
    table,
    filterOptions,
}: DataTableFiltersProps<TData>) {

    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex flex-1 items-center space-x-2">
                {Object.entries(filterOptions).map(([columnId, options]) => {
                    const column = table.getColumn(columnId);
                    if (!column?.getCanFilter()) return null

                    return (
                        <Select
                            key={columnId}
                            value={(column.getFilterValue() as string) || ''}
                            onValueChange={(value) => column.setFilterValue(value === 'all' ? '' : value)}
                        >
                            <SelectTrigger className="h-8 w-[150px]">
                                <SelectValue placeholder={`Filter ${columnId}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                })}
                {isFiltered && (
                    <Button
                    variant='ghost'
                    onClick={() => table.resetColumnFilters()}
                    className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
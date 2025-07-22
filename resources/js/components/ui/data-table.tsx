import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    RowSelectionState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, { useEffect } from "react"
import { Input } from "./input"
import { DataTablePagination } from "./pagination-controls"
import { ExportColumn } from "../exports/export-to"
import { DataTableToolbar } from "../exports/data-table-toolbar"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterValue1: string
    filterValue2: string
    exportColumns?: ExportColumn[]
    exportFilename?: string
    exportTitle?: string
    enableRowSelection?: boolean
    onRowSelectionChange?: (selectedRows: TData[]) => void
    customActions?: React.ReactNode
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterValue1,
    filterValue2,
    exportColumns,
    exportFilename = 'export',
    exportTitle = 'Data Export',
    enableRowSelection = false,
    onRowSelectionChange,
    customActions,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: enableRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    // Update parent component when selection changes
    useEffect(() => {
        if (onRowSelectionChange) {
            const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
            onRowSelectionChange(selectedRows);
        }
    }, [rowSelection, onRowSelectionChange, table]);

    // Get filtered data for export
    const filteredData = table.getFilteredRowModel().rows.map((row) => row.original);
    // const exportData = data;

    return (
        <>
            {/* filter sections / descriptions */}
            <div className="flex items-center py-4 gap-2 border-t border-t-gray-200 border-b border-b-gray-200">
                {/* Custom Actions */}
                {customActions && (
                    <div className="flex items-center gap-2">
                        {customActions}
                    </div>
                )}
                {/* Export Toolbar */}
                {exportColumns && (
                    <DataTableToolbar
                        data={filteredData}
                        exportColumns={exportColumns}
                        filename={exportFilename}
                        title={exportTitle}
                    />
                )}
                <Input
                    placeholder={`Filter ${filterValue1}...`}
                    value={(table.getColumn(`${filterValue1}`)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(`${filterValue1}`)?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                />
                <Input
                    placeholder={`Filter ${filterValue2}...`}
                    value={(table.getColumn(`${filterValue2}`)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(`${filterValue2}`)?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, idx) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                "bg-white",
                                                idx < 3 && "sticky left-0 z-50",
                                                idx === 1 && "left-[24px]",
                                                idx === 2 && "left-[70px]",
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                >
                                    {row.getVisibleCells().map((cell, idx) => {
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    idx < 3 && "sticky left-0 z-10 bg-white",
                                                    idx === 1 && "left-[24px]",
                                                    idx === 2 && "left-[70px]",
                                                )}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <DataTablePagination table={table} />
            </div>
        </>
    );
}
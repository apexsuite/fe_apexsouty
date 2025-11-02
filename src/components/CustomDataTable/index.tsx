import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface CustomDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount?: number
    pageIndex?: number
    pageSize?: number
    totalCount?: number
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
    isLoading?: boolean
}

export default function CustomDataTable<TData, TValue>({
    columns,
    data,
    pageCount = 0,
    pageIndex = 0,
    pageSize = 10,
    totalCount = 0,
    onPageChange,
    onPageSizeChange,
    isLoading = false,
}: CustomDataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount,
    })

    const handleFirstPage = () => onPageChange?.(1)
    const handlePreviousPage = () => onPageChange?.(Math.max(1, pageIndex))
    const handleNextPage = () => onPageChange?.(Math.min(pageCount, pageIndex + 2))
    const handleLastPage = () => onPageChange?.(pageCount)

    const canGoPrevious = pageIndex > 0
    const canGoNext = pageIndex < pageCount - 1

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b bg-muted/50 hover:bg-muted/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="h-12 px-4 font-semibold">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground border-t-primary" />
                                        <p className="text-sm text-muted-foreground">Loading...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <p className="text-sm font-medium text-muted-foreground">No results found</p>
                                        <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pageCount > 0 && (
                <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-medium text-foreground whitespace-nowrap">
                            Total: <span className="font-bold text-primary">{totalCount}</span> records
                        </p>
                        <div className="hidden h-4 w-px bg-border sm:block" />
                        <div className="flex items-center gap-2">
                            <label htmlFor="page-size" className="text-sm text-muted-foreground whitespace-nowrap">
                                Show:
                            </label>
                            <select
                                id="page-size"
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={pageSize}
                                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                                disabled={isLoading}
                            >
                                {[10, 20, 30, 40, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size} per page
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                            Page <span className="font-bold text-foreground">{pageIndex + 1}</span> of{" "}
                            <span className="font-bold text-foreground">{pageCount}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleFirstPage}
                                disabled={!canGoPrevious || isLoading}
                                className="h-9 w-9 transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                                title="First page"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePreviousPage}
                                disabled={!canGoPrevious || isLoading}
                                className="h-9 w-9 transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                                title="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextPage}
                                disabled={!canGoNext || isLoading}
                                className="h-9 w-9 transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                                title="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleLastPage}
                                disabled={!canGoNext || isLoading}
                                className="h-9 w-9 transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                                title="Last page"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
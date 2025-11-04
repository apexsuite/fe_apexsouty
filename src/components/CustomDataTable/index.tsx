import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IPageComponentParams } from "@/utils/hooks/usePagination"
import { usePaginationHandlers } from "./hooks/usePaginationHandlers"
import { TableLoadingState } from "./components/TableLoadingState"
import { TableEmptyState } from "./components/TableEmptyState"
import { TablePaginationControls } from "./components/TablePaginationControls"

interface CustomDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination?: IPageComponentParams;
    setPagination?: (params: IPageComponentParams) => void;
    pageCount?: number
    totalCount?: number
    isLoading?: boolean
}

export default function CustomDataTable<TData, TValue>({
    columns,
    data,
    pagination,
    setPagination,
    totalCount = 0,
    isLoading = false,
}: CustomDataTableProps<TData, TValue>) {
    const paginationState = usePaginationHandlers({
        pagination,
        setPagination,
        totalCount,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: paginationState.pageCount,
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="max-h-[calc(100vh-300px)] overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <div className="max-h-[calc(100vh-350px)] overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <TableHeader className="sticky top-0 z-10 bg-muted">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-b hover:bg-muted">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="h-12 bg-muted px-4 font-semibold">
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
                                <TableLoadingState columnCount={columns.length} />
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
                                <TableEmptyState columnCount={columns.length} />
                            )}
                        </TableBody>
                    </table>
                </div>
            </div>

            <div className="shrink-0">
                <TablePaginationControls
                    currentPage={paginationState.currentPage}
                    currentPageSize={paginationState.currentPageSize}
                    pageCount={paginationState.pageCount}
                    totalCount={totalCount}
                    canGoPrevious={paginationState.canGoPrevious}
                    canGoNext={paginationState.canGoNext}
                    isLoading={isLoading}
                    onPageSizeChange={paginationState.handlePageSizeChange}
                    onFirstPage={paginationState.handleFirstPage}
                    onPreviousPage={paginationState.handlePreviousPage}
                    onNextPage={paginationState.handleNextPage}
                    onLastPage={paginationState.handleLastPage}
                />
            </div>
        </div>
    )
}
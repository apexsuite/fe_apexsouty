import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IPageComponentParams } from '@/utils/hooks/usePagination';
import { usePaginationHandlers } from './hooks/usePaginationHandlers';
import { TableLoadingState } from './components/TableLoadingState';
import { TableEmptyState } from './components/TableEmptyState';
import { TablePaginationControls } from './components/TablePaginationControls';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Frame } from '@/components/ui/frame';

interface CustomDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: IPageComponentParams;
  setPagination?: (params: IPageComponentParams) => void;
  pageCount?: number;
  totalCount?: number;
  isLoading?: boolean;
  renderSubComponent?: (row: TData) => ReactNode;
  getRowCanExpand?: (row: TData) => boolean;
}

export default function CustomDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  totalCount = 0,
  isLoading = false,
  renderSubComponent,
  getRowCanExpand,
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
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: getRowCanExpand
      ? row => getRowCanExpand(row.original)
      : () => false,
    manualPagination: true,
    pageCount: paginationState.pageCount,
  });

  return (
    <Frame className="flex flex-col gap-1">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, idx) => (
            <TableRow key={headerGroup.id + idx}>
              {headerGroup.headers.map((header, idx) => {
                const meta = header.column.columnDef.meta as
                  | { className?: string; style?: React.CSSProperties }
                  | undefined;
                const hasCustomWidth =
                  meta?.className?.includes('w-') ||
                  meta?.style?.width ||
                  header.getSize() !== 150;

                return (
                  <TableHead
                    key={header.id + idx}
                    className={cn(meta?.className)}
                    style={{
                      ...meta?.style,
                      width:
                        meta?.style?.width ||
                        (hasCustomWidth && !meta?.className?.includes('w-')
                          ? header.getSize()
                          : undefined),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoadingState columnCount={columns.length} columns={columns} />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => (
              <>
                <TableRow
                  key={row.id + idx}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => {
                    const meta = cell.column.columnDef.meta as
                      | { className?: string; style?: React.CSSProperties }
                      | undefined;
                    const hasCustomWidth =
                      meta?.className?.includes('w-') ||
                      meta?.style?.width ||
                      cell.column.getSize() !== 150;

                    return (
                      <TableCell
                        key={cell.id + idx}
                        className={cn('p-2', meta?.className)}
                        style={{
                          ...meta?.style,
                          width:
                            meta?.style?.width ||
                            (hasCustomWidth && !meta?.className?.includes('w-')
                              ? cell.column.getSize()
                              : undefined),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {row.getIsExpanded() && renderSubComponent && (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      {renderSubComponent(row.original)}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          ) : (
            <TableEmptyState columnCount={columns.length} />
          )}
        </TableBody>
      </Table>
      {pagination && totalCount > 0 && (
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
      )}
    </Frame>
  );
}

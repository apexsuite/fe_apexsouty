import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TableLoadingStateProps {
  columnCount: number;
  columns?: Array<{
    meta?: { className?: string; style?: React.CSSProperties };
  }>;
  rowCount?: number;
}

export const TableLoadingState = ({
  columnCount,
  columns,
  rowCount = 10,
}: TableLoadingStateProps) => {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, colIndex) => {
            const column = columns?.[colIndex];
            const meta = column?.meta as
              | { className?: string; style?: React.CSSProperties }
              | undefined;
            return (
              <TableCell
                key={colIndex}
                className={cn('shrink-0 p-3', meta?.className)}
                style={meta?.style}
              >
                <Skeleton className="h-6 w-full shrink-0" />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};

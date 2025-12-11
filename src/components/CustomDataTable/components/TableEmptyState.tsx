import { TableRow, TableCell } from '@/components/ui/table';
import {
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { ListFilter } from 'lucide-react';

interface TableEmptyStateProps {
  columnCount: number;
  title?: string;
  description?: string;
}

export const TableEmptyState = ({
  columnCount,
  title = 'No results found',
  description = 'Try adjusting your filters or search terms',
}: TableEmptyStateProps) => {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columnCount} className="py-12">
        <div className="flex flex-col items-center justify-center">
          <EmptyHeader className="max-w-md">
            <EmptyMedia variant="icon">
              <ListFilter className="text-muted-foreground size-5" />
            </EmptyMedia>
            <EmptyTitle className="text-foreground text-base font-semibold">
              {title}
            </EmptyTitle>
            <EmptyDescription className="mt-2 text-sm">
              {description}
            </EmptyDescription>
          </EmptyHeader>
        </div>
      </TableCell>
    </TableRow>
  );
};

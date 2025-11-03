import { TableRow, TableCell } from "@/components/ui/table";

interface TableEmptyStateProps {
    columnCount: number;
}

export const TableEmptyState = ({ columnCount }: TableEmptyStateProps) => {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columnCount} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground">No results found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                </div>
            </TableCell>
        </TableRow>
    );
};


import { TableRow, TableCell } from "@/components/ui/table";

interface TableLoadingStateProps {
    columnCount: number;
}

export const TableLoadingState = ({ columnCount }: TableLoadingStateProps) => {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columnCount} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground border-t-primary" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </TableCell>
        </TableRow>
    );
};


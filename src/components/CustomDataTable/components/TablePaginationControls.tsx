import { PageSizeSelector } from "./PageSizeSelector";
import { PaginationNavigationButtons } from "./PaginationNavigationButtons";

interface TablePaginationControlsProps {
    currentPage: number;
    currentPageSize: number;
    pageCount: number;
    totalCount: number;
    canGoPrevious: boolean;
    canGoNext: boolean;
    isLoading: boolean;
    onPageSizeChange: (size: number) => void;
    onFirstPage: () => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onLastPage: () => void;
}

export const TablePaginationControls = ({
    currentPage,
    currentPageSize,
    pageCount,
    totalCount,
    canGoPrevious,
    canGoNext,
    isLoading,
    onPageSizeChange,
    onFirstPage,
    onPreviousPage,
    onNextPage,
    onLastPage,
}: TablePaginationControlsProps) => {
    if (pageCount === 0) return null;

    return (
        <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-foreground whitespace-nowrap leading-none">
                    Total: <span className="font-bold text-primary">{totalCount}</span> records
                </p>

                <div className="hidden h-4 w-px bg-border sm:block" />
                <PageSizeSelector
                    currentPageSize={currentPageSize}
                    onPageSizeChange={onPageSizeChange}
                    isLoading={isLoading}
                />
            </div>


            <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Page <span className="font-bold text-foreground">{currentPage}</span> of{" "}
                    <span className="font-bold text-foreground">{pageCount}</span>
                </p>
                <PaginationNavigationButtons
                    onFirstPage={onFirstPage}
                    onPreviousPage={onPreviousPage}
                    onNextPage={onNextPage}
                    onLastPage={onLastPage}
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};


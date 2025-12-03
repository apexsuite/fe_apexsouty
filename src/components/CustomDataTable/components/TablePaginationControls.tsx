import { PageSizeSelector } from './PageSizeSelector';
import { PaginationNavigationButtons } from './PaginationNavigationButtons';

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
    <div className="bg-card flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <p className="text-foreground text-sm leading-none font-medium whitespace-nowrap">
          {`${totalCount} ${totalCount === 1 ? 'record' : 'records'}`}
        </p>

        <PageSizeSelector
          currentPageSize={currentPageSize}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-muted-foreground text-sm font-medium whitespace-nowrap">
          Page {currentPage} of {pageCount}
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

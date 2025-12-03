import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationNavigationButtonsProps {
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLoading: boolean;
}

export const PaginationNavigationButtons = ({
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  canGoPrevious,
  canGoNext,
  isLoading,
}: PaginationNavigationButtonsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={onFirstPage}
        disabled={!canGoPrevious || isLoading}
        className="hover:bg-primary hover:text-primary-foreground h-9 w-9 transition-all disabled:opacity-50"
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousPage}
        disabled={!canGoPrevious || isLoading}
        className="hover:bg-primary hover:text-primary-foreground h-9 w-9 transition-all disabled:opacity-50"
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onNextPage}
        disabled={!canGoNext || isLoading}
        className="hover:bg-primary hover:text-primary-foreground h-9 w-9 transition-all disabled:opacity-50"
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onLastPage}
        disabled={!canGoNext || isLoading}
        className="hover:bg-primary hover:text-primary-foreground h-9 w-9 transition-all disabled:opacity-50"
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

import CustomButton from '@/components/CustomButton';
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
      <CustomButton
        variant="outline"
        size="icon-sm"
        onClick={onFirstPage}
        disabled={!canGoPrevious || isLoading}
        icon={<ChevronsLeft />}
        title="First page"
      />
      <CustomButton
        variant="outline"
        size="icon-sm"
        onClick={onPreviousPage}
        disabled={!canGoPrevious || isLoading}
        title="Previous page"
        icon={<ChevronLeft />}
      />
      <CustomButton
        variant="outline"
        size="icon-sm"
        onClick={onNextPage}
        disabled={!canGoNext || isLoading}
        title="Next page"
        icon={<ChevronRight />}
      />
      <CustomButton
        variant="outline"
        size="icon-sm"
        onClick={onLastPage}
        disabled={!canGoNext || isLoading}
        title="Last page"
        icon={<ChevronsRight />}
      />
    </div>
  );
};

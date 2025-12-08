import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PageSizeSelectorProps {
  currentPageSize: number;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export const PageSizeSelector = ({
  currentPageSize,
  onPageSizeChange,
  isLoading,
}: PageSizeSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={String(currentPageSize)}
        onValueChange={value => onPageSizeChange(Number(value))}
        disabled={isLoading}
      >
        <SelectTrigger className="h-8 w-fit shadow-none">
          <SelectValue placeholder="Select page size" />
        </SelectTrigger>
        <SelectContent className="w-fit">
          {PAGE_SIZE_OPTIONS.map(size => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

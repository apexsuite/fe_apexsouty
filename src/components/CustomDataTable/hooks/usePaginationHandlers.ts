import { useMemo } from "react";
import { IPageComponentParams } from "@/utils/hooks/usePagination";

interface UsePaginationHandlersProps {
    pagination?: IPageComponentParams;
    setPagination?: (params: IPageComponentParams) => void;
    totalCount: number;
}

/**
 * Pagination mantığını ve handler fonksiyonlarını yöneten custom hook
 */
export const usePaginationHandlers = ({
    pagination,
    setPagination,
    totalCount,
}: UsePaginationHandlersProps) => {
    // Mevcut pagination değerleri
    const currentPage = pagination?.page || 1;
    const currentPageSize = pagination?.pageSize || 10;
    const pageCount = Math.ceil(totalCount / currentPageSize) || 1;

    // Navigasyon durumları
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < pageCount;

    // Handler fonksiyonları
    const handlers = useMemo(() => {
        const handlePageChange = (newPage: number) => {
            if (setPagination) {
                setPagination({
                    page: newPage,
                    pageSize: currentPageSize,
                    firstRow: (newPage - 1) * currentPageSize + 1,
                });
            }
        };

        const handlePageSizeChange = (newPageSize: number) => {
            if (setPagination) {
                setPagination({
                    page: 1, // Sayfa boyutu değiştiğinde ilk sayfaya dön
                    pageSize: newPageSize,
                    firstRow: 1,
                });
            }
        };

        return {
            handlePageChange,
            handlePageSizeChange,
            handleFirstPage: () => handlePageChange(1),
            handlePreviousPage: () => handlePageChange(Math.max(1, currentPage - 1)),
            handleNextPage: () => handlePageChange(Math.min(pageCount, currentPage + 1)),
            handleLastPage: () => handlePageChange(pageCount),
        };
    }, [setPagination, currentPage, currentPageSize, pageCount]);

    return {
        currentPage,
        currentPageSize,
        pageCount,
        canGoPrevious,
        canGoNext,
        ...handlers,
    };
};


import { useMemo, useState } from 'react';
import { IPageParams } from '@/types/common.types';
import useQueryParams from '@/utils/hooks/useQueryParams';

export type IPageComponentParams = IPageParams & { firstRow: number };

/**
 * @description This hook is used to handle pagination.
 * @param updateQuery - If true, the pagination will be updated in the query params.
 */

const usePagination = (
    updateQuery = true
): [
        { request: IPageParams; componentParams: IPageComponentParams },
        (params: IPageComponentParams) => void,
        () => void
    ] => {
    const { getQueryParam, updateQueryParams } = useQueryParams();
    const [localPage, setLocalPage] = useState<IPageParams>({
        page: 1,
        pageSize: 10,
    });

    const pagination = useMemo(() => {
        let page;
        let pageSize;

        if (updateQuery) {
            page = Number(getQueryParam('page')) || 1;
            pageSize = Number(getQueryParam('pageSize')) || 10;
        } else {
            page = localPage.page;
            pageSize = localPage.pageSize;
        }

        return {
            request: { page, pageSize },
            componentParams: {
                page,
                pageSize,
                firstRow: (page - 1) * pageSize + 1,
            },
        };
    }, [getQueryParam, updateQuery, localPage]);

    const setPage = (params: IPageComponentParams) => {
        if (updateQuery) {
            updateQueryParams({ page: params.page, pageSize: params.pageSize });
        } else {
            setLocalPage({ page: params.page, pageSize: params.pageSize });
        }
    };

    const reset = () => {
        if (updateQuery) {
            updateQueryParams({ page: 1, perPage: 10 });
        } else {
            setLocalPage({ page: 1, pageSize: 10 });
        }
    };

    return [pagination, setPage, reset];
};

export default usePagination;

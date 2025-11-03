export interface IPageResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    pageCount: number;
    totalCount: number;
}

export interface IPageParams {
    page: number;
    pageSize: number;
}
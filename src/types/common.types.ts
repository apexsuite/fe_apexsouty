export interface IPageResponse<T> {
    items: T[];
    data: T[];
    page: number;
    pageSize: number;
    pageCount: number;
    totalCount: number;
}

export interface IPageParams {
    page: number;
    pageSize: number;
}

export interface IAttachment {
    id?: string;             // UUID: Attachment ID
    filePath: string;       // "tickets/abc123.png"
    fileName: string;       // "screenshot.png"
    contentType: string;    // "image/png"
    uploadedBy?: string;     // UUID: User ID
    createdAt?: string;
}

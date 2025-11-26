export interface IUploadFileRequest {
  fileName: string;
  folderType: string;
}

export interface IUploadFileResponse {
  url: string;
  fileName?: string;
  fileSize?: number;
}

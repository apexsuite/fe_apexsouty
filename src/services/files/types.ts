export interface IFileRequest {
  fileName: string;
  folderType: string;
}

export interface IFileResponse {
  filePath: string;
  uploadURL: string;
}

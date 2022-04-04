export interface File {
  fileId: number;
  userId: number;
  filename: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface FileCreate {
  filename: string;
}

export interface FileListItem {
  fileId: number
  filename: string
  createdAt: Date
  updatedAt: Date
}

export interface DeletedFile {
  username: string,
  filename: string
}
export interface File {
  fileId: number;
  userId: number;
  filename: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface FileCreate {
  filename: string;
}
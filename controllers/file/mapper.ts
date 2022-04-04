import { File, FileCreate, FileListItem, DeletedFile } from "../../interfaces"
import { FileOutput } from "../../models/file.model"

export const toFile = (file: FileOutput): File => {
  return {
    fileId: file.fileId,
    userId: file.userId,
    filename: file.filename,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
    deletedAt: file.deletedAt
  }
}

export const toFileCreate = (file: FileOutput): FileCreate => {
  return {
    filename: file.filename
  }
}

export const toFileItem = (file: FileOutput): FileListItem => {
  return {
    fileId: file.fileId,
    filename: file.filename,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt
  }
}

export const toDeletedFileName = (file: FileOutput): string => {
  return file.filename
}
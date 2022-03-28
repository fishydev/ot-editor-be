import { File, FileCreate } from "../../interfaces"
import { FileOutput } from "../../models/file.model"

export const toFile = (file: FileOutput): File => {
  return {
    fileId: file.fileId,
    userId: file.userId,
    isDeleted: file.isDeleted,
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
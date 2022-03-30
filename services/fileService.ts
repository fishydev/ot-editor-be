import * as fileDal from "../db/dal/file"
import { FileInput, FileOutput } from "../models/file.model"

export const create = (payload: FileInput): Promise<FileOutput> => {
  return fileDal.create(payload)
}

export const getByUserId = (userId: number): Promise<FileOutput[]> => {
  return fileDal.getByUserId(userId)
}
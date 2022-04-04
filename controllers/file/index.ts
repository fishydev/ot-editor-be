import * as service from "../../services/fileService"
import { CreateFileDTO } from "../../dto/file.dto"
import { File, FileCreate, FileListItem } from "../../interfaces"
import * as mapper from "./mapper"
import * as fs from "fs"
import { FileOutput } from "../../models/file.model"

export const create = async (payload: CreateFileDTO): Promise<FileCreate> => {
    await service.generateFile(payload)
    return mapper.toFileCreate(await service.create(payload))
}

export const getByUserId = async (userId: number): Promise<FileListItem[]> => {
  return (await service.getByUserId(userId)).map(mapper.toFileItem)
}

export const deleteByFileId = async (fileId: number, username: string): Promise<boolean> => {
  const deletedFilename = mapper.toDeletedFileName(await service.getByFileId(fileId))
  const isDeleted = await service.deleteByFileId(fileId)

  if (isDeleted) {
    await service.tagDeleteFile(username, deletedFilename)
  }

  return isDeleted
}

export const getFileContent = async (username: string, filename: string): Promise<Buffer> => {
  return service.getFileContent(username, filename)
}
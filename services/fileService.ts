import * as fileDal from "../db/dal/file"
import { FileInput, FileOutput } from "../models/file.model"
import * as fs from "fs-extra"
import { CreateFileDTO } from "../dto/file.dto"
import { v4 as uuidv4 } from "uuid"

export const create = async (payload: FileInput): Promise<FileOutput> => {
  return fileDal.create(payload)
}

export const getByUserId = (userId: number): Promise<FileOutput[]> => {
  return fileDal.getByUserId(userId)
}

export const getByFileId = (fileId: number): Promise<FileOutput> => {
  return fileDal.getById(fileId)
}

export const deleteByFileId = (fileId: number): Promise<boolean> => {
  return fileDal.deleteById(fileId)
}

export const generateFile = async (payload: CreateFileDTO) => {
  const filename = payload.filename
  const username = payload.username

  const filePath = `./files/${username}/${filename}.txt`

  fs.outputFile(filePath, `write something!`, (error) => {
    if (error) {
      console.log(error)
      throw {
        code: 500,
        message: error
      }
    }
    console.log(`user ${username} created ${filename}.txt`)
  })
}

export const tagDeleteFile = async (username: string, filename: string) => {
  const oldPath = `./files/${username}/${filename}.txt`
  const newPath = `./files/${username}/${filename}.txt.DELETED`
  // console.log(`oldPath: ${oldPath}`)
  // console.log(`newPath: ${newPath}`)
  fs.rename(oldPath, newPath, (error) => {
    if (error) {
      console.log(error)
      throw {
        code: 500,
        message: "Failed to delete file"
      }
    } else {
      console.log(`deleted ${filename}.txt`)
    }
  })
}

export const getFileContent = async (username: string, filename: string): Promise<Buffer> => {
  const path = `./files/${username}/${filename}.txt`

  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, content) => {
      if (error) {
        reject(error)
      }
      resolve(content)
    })
  })
}
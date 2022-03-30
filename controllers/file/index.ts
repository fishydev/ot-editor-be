import * as service from "../../services/fileService"
import { CreateFileDTO } from "../../dto/file.dto"
import { File, FileCreate, FileListItem } from "../../interfaces"
import * as mapper from "./mapper"
import * as fs from "fs"

export const create = async (payload: CreateFileDTO): Promise<FileCreate> => {
    const filename = payload.filename
    const filePath = `./files/${filename}.txt`

    fs.writeFile(filePath, `write something!`, (error) => {
      if (error) {
        console.log(error)
        throw {
          code: 500,
          message: error
        }
      }
      console.log(`user ${payload.username} created ${filename}.txt`)
    })
    return mapper.toFileCreate(await service.create(payload))
}

export const getByUserId = async (userId: number): Promise<FileListItem[]> => {
  return (await service.getByUserId(userId)).map(mapper.toFileItem)
}
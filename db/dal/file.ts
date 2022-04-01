import { Op } from "sequelize"
import File, { FileInput, FileOutput } from "../../models/file.model"

export const create = async(payload: FileInput): Promise<FileOutput> => {
  const file = await File.create(payload)
  return file
}

// export const update = async (id: number, payload: Partial<FileInput>): Promise<FileOutput> => {
//   const file = await User.findByPk(id)
//   if (!file) {
//     throw new Error('User not found')
//   }
//   const updatedUser = await (file as User).update(payload)
//   return updatedUser
// }

export const getById = async (id: number): Promise<FileOutput> => {
  const file = await File.findByPk(id)
  if (!file) {
    throw new Error("File not found")
  }
  return file
}

export const getByUserId = async (userId: number): Promise<FileOutput[]> => {
  return await File.findAll({
    where: {
      userId: userId
    }
  })
}

export const deleteById = async (fileId: number): Promise<boolean> => {
  const deletedFileCount =  await File.destroy(
    {
      where: {
        fileId: fileId
      },
    },
  )
  return !!deletedFileCount
}

// export const deleteById = async (id: number): Promise<boolean> => {
//   const deletedUserCount = await User.destroy({
//     where: {
//       fileId: id
//     }
//   })
//   return !!deletedUserCount
// }

// export const checkDuplicateUsername = async (filename: string): Promise<boolean> => {
//   const duplicateUsername = await User.findOne({
//     where: {
//       filename: filename
//     }
//   })
//   return !!duplicateUsername
// }

// export const checkDuplicateEmail = async (email: string): Promise<boolean> => {
//   const duplicateEmail = await User.findOne({
//     where: {
//       email: email
//     }
//   })
//   return !!duplicateEmail
// }
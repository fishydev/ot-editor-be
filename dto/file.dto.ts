import { Optional } from "sequelize"

export type CreateFileDTO = {
  filename: string,
  username: string,
  userId: number
}
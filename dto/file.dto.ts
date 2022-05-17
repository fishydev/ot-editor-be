import { Optional } from "sequelize"

export type CreateFileDTO = {
  filename: string,
  uuid: string,
  username: string,
  userId: number,
}
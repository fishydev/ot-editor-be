import { Optional } from "sequelize"

export type CreateUserDTO = {
  username: string;
  email: string;
  password: string
}
import { User } from "../../interfaces"
import { UserOutput } from "../../models/user.model"

export const toUser = (user: UserOutput): User => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt:user.deletedAt,
  }
}
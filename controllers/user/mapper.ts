import { User } from "../../interfaces"
import { UserOutput } from "../../models/user.model"

export const toUser = (user: UserOutput): User => {
  return {
    userId: user.userId,
    email: user.email,
    username: user.username,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt:user.deletedAt,
  }
}
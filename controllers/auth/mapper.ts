import { Auth } from "../../interfaces"
import { UserOutput } from "../../models/user.model"

export const toAuth = (user: UserOutput, token: string): Auth => {
  return {
    userId: user.userId,
    username: user.username,
    token: token
  }
}
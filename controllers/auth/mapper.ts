import { Auth } from "../../interfaces"
import { UserOutput } from "../../models/user.model"

export const toAuth = (user: UserOutput, token: string): Auth => {
  return {
    username: user.username,
    password: user.password,
    token: token
  }
}
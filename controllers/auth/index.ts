import * as service from "../../services/userService"
import { CreateUserDTO } from "../../dto/user.dto"
import { LoginDTO } from "../../dto/auth.dto"
import { Auth } from "../../interfaces"
import * as mapper from "./mapper"


export const login = async (payload: LoginDTO): Promise<Auth> => {
  const user = await service.getByUsername(payload.username)

  if (payload.password !== user.password) {
    throw {
      code: 401,
      message: "invalid credentials"
    }
  }

  let token = "token goes here"

  return mapper.toAuth(user, token)
}
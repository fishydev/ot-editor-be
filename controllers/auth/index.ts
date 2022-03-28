import * as service from "../../services/userService"
import { CreateUserDTO } from "../../dto/user.dto"
import { LoginDTO } from "../../dto/auth.dto"
import { Auth } from "../../interfaces"
import * as mapper from "./mapper"
import * as jwt from "jsonwebtoken"
import config from "../../config/config"


export const login = async (payload: LoginDTO): Promise<Auth> => {
  const user = await service.getByUsername(payload.username)

  if (payload.password !== user.password) {
    throw {
      code: 401,
      message: "invalid login credentials"
    }
  }

  const token = jwt.sign(
    { userId: user.userId, username: user.username },
    config.jwtSecret,
    { expiresIn: "24h" }
  )

  return mapper.toAuth(user, token)
}
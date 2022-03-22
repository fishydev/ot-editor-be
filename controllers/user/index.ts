import * as service from "../../services/userService"
import { CreateUserDTO } from "../../dto/user.dto"
import { User } from "../../interfaces"
import * as mapper from "./mapper"

export const create = async (payload: CreateUserDTO): Promise<User> => {
  return mapper.toUser(await service.create(payload))
}
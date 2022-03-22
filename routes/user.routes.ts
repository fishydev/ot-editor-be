import { Router, Request, Response } from "express"
import * as userController from "../controllers/user"
import { CreateUserDTO } from "../dto/user.dto"
import UserMiddleware from "../middleware/user.middleware"

const userRouter = Router()

//create user
userRouter.post('/', UserMiddleware.createUserValidation , async (req: Request, res: Response) => {
  const payload: CreateUserDTO = req.body
  const result = await userController.create(payload)
  return res.status(200).send(result)
})

//get user by id
userRouter.get('/id', async () => {
//
})

export default userRouter
import { Router, Request, Response } from "express"
import * as authController from "../controllers/auth"
import { LoginDTO } from "../dto/auth.dto"

const authRouter = Router()

//login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const payload: LoginDTO = req.body
    const result = await authController.login(payload)
    return res.status(200).send(result)
  } catch (error: any) {
    console.log(error)
    if (error.code) {
      return res.status(error.code).send(error.message)
    } else {
      return res.status(500).send("unknown error")
    }
  }
})

export default authRouter
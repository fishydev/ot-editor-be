import { Router, Request, Response } from "express"
import * as fileController from "../controllers/file"
import { CreateFileDTO } from "../dto/file.dto"
import * as jwt from "jsonwebtoken"
import { File } from "../interfaces/file.interface"

const fileRouter = Router()

//create file
fileRouter.post('/create' , async (req: Request, res: Response) => {
  try {
    if (!req.headers["authorization"]) {
      throw {
        code: 200,
        message: "unauthorized"
      }
    }
    const tokenPayload: any = jwt.decode(req.headers["authorization"], { complete: true })?.payload


    const payload: CreateFileDTO = {
      filename: req.body.filename,
      userId: tokenPayload.userId,
      username: tokenPayload.username
    }
    const result = await fileController.create(payload)
    
    return res.status(200).send(result)
  } catch (error: any) {
    if (error.code) {
      return res.status(error.code).send(error.message)
    } else {
      console.log(error)
      return res.status(500).send("internal server error")
    }
  }
})

//get file by id
fileRouter.get('/id', async () => {
//
})

fileRouter.get('/user', async (req: Request, res: Response) => {
  try {
    if (!req.headers["authorization"]) {
      throw {
        code: 200,
        message: "unauthorized"
      }
    }
    const tokenPayload: any = jwt.decode(req.headers["authorization"], { complete: true })?.payload
    const result = await fileController.getByUserId(tokenPayload.userId)
    
    return res.status(200).send(result)
    }
    catch (error: any) {
    if (error.code) {
      return res.status(error.code).send(error.message)
    } else {
      console.log(error)
      return res.status(500).send("internal server error")
    }
  }
})

export default fileRouter
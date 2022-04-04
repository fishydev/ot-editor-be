import { Router, Request, Response } from "express"
import * as fileController from "../controllers/file"
import { CreateFileDTO } from "../dto/file.dto"
import * as jwt from "jsonwebtoken"
import { File } from "../interfaces/file.interface"
import { servicesVersion } from "typescript"
import * as fs from "fs-extra"

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

//get file by id NEED FIX
fileRouter.get('/user/:username/:filename', async (req: Request, res: Response) => {
  try {
    const username = req.params.username
    const filename = req.params.filename
    const path = `./files/${username}/${filename}.txt`
    fs.readFile(path, (err, data) => {
      if (err) throw err

      res.writeHead(200, { "Content-Type": "text/html" })
      res.write(data)
      return res.send()
    })
  } catch (err) {
    console.log(err)
    res.status(500).send("failed to get file")
  }
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

fileRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.headers["authorization"]) {
      throw {
        code: 200,
        message: "unauthorized"
      }
    }
    const tokenPayload: any = jwt.decode(req.headers["authorization"], { complete: true })?.payload
    const username = tokenPayload.username
    const fileId = parseInt(req.params.id)
    const result = await fileController.deleteByFileId(fileId, username)
    if (result) return res.status(200).send(`file successfully deleted`)
    else return res.status(500).send(`failed to delete file`)
  } catch (error: any) {
    if (error.code) {
      return res.status(error.code).send(error.message)
    } else {
      console.log(error)
      return res.status(500).send(`internal server error`)
    }
  }
})

export default fileRouter
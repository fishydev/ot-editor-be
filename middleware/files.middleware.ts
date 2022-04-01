import * as fs from "fs"
import { Request, Response, NextFunction } from "express"
import { User } from "../models"



export const checkFileExists = (req: Request, res: Response, next: NextFunction) => {
  const fileId = req.params.id
  const path = `./files/${fileId}.txt`
  // console.log("called checkFileExists")

  try {
    if (fs.existsSync(path)) {
      next()
    } else {
      throw new Error(`${path} not found`)
    }
  } catch (err) {
    console.log(err)
    res.status(404).send("file not found")
  }
}
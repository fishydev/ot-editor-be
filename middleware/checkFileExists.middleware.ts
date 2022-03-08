import * as fs from "fs"
import * as express from "express"



const checkFileExists = (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

export default checkFileExists
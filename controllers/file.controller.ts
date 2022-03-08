import * as fs from "fs"
import * as express from "express"

const getFile = async (req: express.Request, res: express.Response) => {
  const fileId = req.params.id
  const path = `./files/${fileId}.txt`

  // console.log("called getFile")

  try {
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


  // try {
  //   fs.access(path, fs.constants.F_OK, (err) => {
  //     if (err) {
  //       throw err
  //     }
  //     return
  //   })
  // } catch (err) {
  //   console.log(err)
  // }
}

const createFile = async (req: express.Request, res: express.Response) => {
  const fileId = req.params.id
  const path = `./files/${fileId}`

  try {
    fs.writeFile(`${path}.txt`, "write something!", (err) => {
      if (err) throw err;
      console.log(`Created file with id ${fileId}`)
      res.status(200).send(`successfully created file ${fileId}.txt`)
    })
  } catch (err) {
    console.log(`failed to create file ${fileId}.txt`)
    res.status(500).send(`failed to create file`)
  }
}

// const deleteFile = async (req: express.Request, res: express.Response) => {
//   const fileId = req.params.id
//   const path = `./files/${fileId}`

//   try {
//     fs.
//   }
// }

export default {
  getFile,
  createFile
}
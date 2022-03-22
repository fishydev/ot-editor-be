import * as express from "express"

const createUserValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.body.email) return res.status(400).send("email cannot be null")
  if (!req.body.username) return res.status(400).send("username cannot be null")
  if (!req.body.password) return res.status(400).send("password cannot be null")
  next()
}

export default {
  createUserValidation
}
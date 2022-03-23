import * as express from "express"
import { checkDuplicateEmail, checkDuplicateUsername } from "../db/dal/user"

const checkNullValue = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.body.email) return res.status(400).send("email cannot be null")
  if (!req.body.username) return res.status(400).send("username cannot be null")
  if (!req.body.password) return res.status(400).send("password cannot be null")
  next()
}

const checkDuplicateValue = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const isDuplicateEmail = await checkDuplicateEmail(req.body.email)
  if (isDuplicateEmail) return res.status(400).send("Email already registered")
  const isDuplicateUsername = await checkDuplicateUsername(req.body.username)
  if (isDuplicateUsername) return res.status(400).send("Username already registered")
  next()
}

export default {
  checkNullValue,
  checkDuplicateValue
}
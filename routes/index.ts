import { Router } from "express"
import userRouter from "./user.routes"
import authRouter from "./auth.routes"
import fileRouter from "./file.routes"

const router = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/file', fileRouter)

export default router
import { Router } from "express"
import userRouter from "./user.routes"
import authRouter from "./auth.routes"

const router = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)

export default router
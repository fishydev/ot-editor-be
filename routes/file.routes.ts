import * as express from "express"

import checkFileExists from "../middleware/checkFileExists.middleware"
import FileController from "../controllers/file.controller"


// const checkFileExists = require ("../middleware/checkFileExists.middleware")
const router = express.Router()

router.get("/:id", checkFileExists, FileController.getFile)
router.post("/:id", FileController.createFile)

export default router
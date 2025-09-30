import express from "express"

import * as categoryController from "../Controllers/categoryController.js"

const router = express.Router()

router.post('/test',categoryController.createClient)

export default router
import express from 'express'
const router = express.Router()
import { generateIdea } from '../controllers/openaiController.js'

router.post('/generate', generateIdea)

export default router

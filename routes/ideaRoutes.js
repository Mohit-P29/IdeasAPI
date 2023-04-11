// backend/routes/ideaRoutes.js

import express from 'express'
const router = express.Router()
import { getIdeas, getRandomIdea } from '../controllers/ideaController.js'

router.get('/', getIdeas)
router.get('/random', getRandomIdea)

export default router

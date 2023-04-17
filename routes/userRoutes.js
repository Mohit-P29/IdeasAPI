import express from 'express'
import {
  createUser,
  getUserByID,
  swipe,
  processClaim
} from '../controllers/userController.js'
import User from '../models/userModel.js'

const router = express.Router()

router.get('/:id', getUserByID)
router.post('/create', createUser)

router.post('/swipe', swipe)
router.post('/processClaim', processClaim)

// this is a route for development purposes only
router.post('/clearMalekIdeas', async (req, res) => {
  // Replace this with the user's _id you want to clear the swipedIdeas array for
  const userId = '64286fbe940e238c4a53f8fd'

  // Clear the swipedIdeas array for the specified user
  await User.updateOne(
    { _id: userId },
    {
      $set: {
        swipedIdeas: [],
      },
    }
  )
  console.log('SwipedIdeas array cleared')
  res.status(200).json({ message: 'SwipedIdeas array cleared' })
})
export default router

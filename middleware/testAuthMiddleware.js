import User from '../models/userModel.js'

const testAuthMiddleware = async (req, res, next) => {
  try {
    // malek.jerbi11@gmail.com was created for testing purposes only.
    const testUser = await User.findOne({ email: 'malek.jerbi11@gmail.com' })

    // Check if the test user exists, otherwise throw an error
    if (!testUser) {
      throw new Error('Test user not found')
    }

    // Attach the test user's ID to the req.auth object
    req.auth = {
      payload: {
        sub: testUser._id,
      },
    }

    // Continue with the next middleware or route handler
    next()
  } catch (error) {
    console.error('Error in testAuthMiddleware:', error)
    res.status(500).json({ error: 'An error occurred in testAuthMiddleware' })
  }
}

export default testAuthMiddleware

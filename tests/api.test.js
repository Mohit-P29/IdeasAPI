import request from 'supertest'
import app from '../server'
import Idea from '../models/ideaModel'
import mongoose from 'mongoose'

describe('POST /users/swipe', () => {
  let idea

  beforeAll(async () => {
    // Create a sample idea
    idea = new Idea({
      text: 'This is a sample idea for testing purposes.',
      likes: 0,
    })
    console.log(idea)
    await idea.save()
  })

  afterAll(async () => {
    // Clean up the created idea
    await Idea.deleteOne({ _id: idea._id })
  })

  afterAll(async () => {
    // Close the MongoDB connection
    await mongoose.connection.close()
  })

  test('Swipe right increases the likes count of an idea', async () => {
    const initialLikesCount = idea.likes

    const res = await request(app).post('/users/swipe').send({
      ideaId: idea._id,
      action: 'right', // Use `action` instead of `direction`
    })

    // Refresh the idea data from the database
    const updatedIdea = await Idea.findById(idea._id)

    expect(res.status).toBe(200)
    expect(updatedIdea.likes).toBe(initialLikesCount + 1)
  })
})

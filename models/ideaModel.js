import mongoose from 'mongoose'

const ideaSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
})

const Idea = mongoose.model('Idea', ideaSchema)

export default Idea

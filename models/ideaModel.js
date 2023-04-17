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
  price: {
    type: Number,
    required: true,
    default: 1,
  },
  claimed: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const Idea = mongoose.model('Idea', ideaSchema)

export default Idea

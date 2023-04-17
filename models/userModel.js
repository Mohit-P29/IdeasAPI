import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    auth0Id: {
      // Add this field to store the Auth0 'sub'
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      required: true,
      default: 10,
    },
    swipedIdeas: [
      {
        idea: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Idea',
        },
        ideaText: {
          type: String,
        },
        claimed: {
          type: Boolean,
          required: true,
          default: false,
        },
        action: {
          type: String,
          enum: ['right', 'left'],
        },
      },
    ],
    claimedIdeas: [
      {
        idea: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Idea',
        },
        ideaText: {
          type: String,
        },
      }
    ],
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User

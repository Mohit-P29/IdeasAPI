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
    swipedIdeas: [
      {
        idea: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Idea',
        },
        action: {
          type: String,
          enum: ['right', 'left'],
        },
      },
    ],
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User

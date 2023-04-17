import User from '../models/userModel.js'
import Idea from '../models/ideaModel.js'

// save new user to database
export const createUser = async (req, res) => {
  try {
    console.log('DEBUG: Inside CreateUser()')

    const { email, name } = req.body
    const auth0Id = req.auth.payload.sub

    let user = await User.findOne({ auth0Id })

    if (user) {
      console.log('DEBUG: Found Existing User')
      res.status(200).json({
        success: true,
        error: 'User is already saved so will be retruning it',
        data: user,
      })
    } else {
      user = await User.findOne({ email })

      if (user) {
        console.log('DEBUG: Found User with Same Email')
        user.auth0Id = auth0Id
        await user.save()
      } else {
        console.log('DEBUG: Creating New User')
        user = new User({ email: email, name: name, auth0Id: auth0Id })
        await user.save()
      }

      res.status(201).json({
        success: true,
        message: 'User Has been saved ',
        data: user,
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send()
  }
}

// gets user by ID

export const getUserByID = async (req, res) => {
  try {
    console.log('DEBUG: InsideGetUserByID')

    const userID = req.params.id

    const user = await User.findById(userID)

    // No user found
    if (!user) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'No user found with that ID' })
    }
    //res.status(200).json({ status: 'success', data: user })

    res.status(200).json({
      success: true,
      message: 'User Returned',
      data: user,
    })
  } catch (err) {
    // Invalid id
    res.status(400).json({ status: 'fail', message: err })
  }
}

export const swipe = async (req, res) => {
  try {
    // Get the required information from the request body
    const { ideaId, action,ideaText } = req.body
    const userId = req.auth.payload.sub

    // Find the user by their auth0Id
    const user = await User.findOne({ auth0Id: userId })

    // Update the user's swipedIdeas array
    await User.updateOne(
      {
        auth0Id: userId, // Use auth0Id instead of _id
        'swipedIdeas.idea': { $ne: ideaId },
      },
      {
        $addToSet: {
          swipedIdeas: {
            idea: ideaId,
            ideaText: ideaText,
            action: action,
          },
        },
      }
    )

    // Implement the likes logic based on the action
    if (action === 'right') {
      await Idea.findByIdAndUpdate(ideaId, { $inc: { likes: 1 } })
    } else if (action === 'left') {
      await Idea.findByIdAndUpdate(ideaId, { $inc: { likes: -1 } })
    }

    console.log('Swipe recorded successfully')
    // Send a success response
    res.status(200).json({ message: 'Swipe recorded successfully' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while recording the swipe' })
  }
}


export const processClaim = async (req, res) => {

  try {
    console.log('processing claim in controller...')
    // Get the required information from the request body
    const { userId, ideaId } = req.body;
    console.log('user ID and idea ID from req: ',userId, ideaId)
  
    const idea = await Idea.findById(ideaId);
    const user = await User.findById(userId);
    console.log('user and idea from find by id: ',user, idea)
  
    if (!idea) {
      console.log('NULL idea')
      return res.status(404).json({ error: `No idea found with ID ${ideaId}` });
    }

    // Check if the idea has already been claimed
    if (idea.claimed) {
      console.log('Idea has already been claimed');
      return res.status(400).json({ error: 'Idea has already been claimed by another user' });
    }

    const balance = user["credits"];
    const price = idea["price"];
  
    console.log('idea id : ' + ideaId  + ' idea price: ' + price)
    console.log('user id : ' + user.id + ' balance : ' + balance)

    if (balance >= price) {
      console.log(`User has sufficient balance (${balance} credits)`);
  
      const newBalance = balance - price;
  
      user.credits = newBalance;
      await user.save();
      res.send({ credits: newBalance });

      // Add the claimed idea to the user's claimedIdeas array
      user.claimedIdeas.push({ idea: ideaId, ideaText: idea.text });
      await user.save();

      // Set the idea's claimed status and claimedBy fields
      idea.claimed = true;
      await idea.save();

      // changing claimed status in swipedIdeas to true
      User.findOneAndUpdate(
        { _id: userId, 'swipedIdeas.idea': ideaId }, // find user document with matching ID and swiped idea with matching ID
        { $set: { 'swipedIdeas.$.claimed': true } }, // update claimed field to true for matching swiped idea
        { new: true } // return updated user document after update is applied
      )
        .then(updatedUser => {
          console.log('Updated user:', updatedUser);
        })
        .catch(error => {
          console.log('Error updating user:', error);
        });
  
      console.log(`User current balance (${user.credits} credits) and claimed ideas (${user.claimedIdeas})`);
  
    } else {
      console.log(`User has insufficient balance (${balance} credits)`);
      alert("Insufficient credits!");
      return;
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Error processing claim' })
  }
  }
  

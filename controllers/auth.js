const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ 
      user: { 
        name: user.name,
        lastName: user.lastName,
        location: user.location,
        email: user.email, 
        token 
      }, 
    })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ 
    user: { 
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      email: user.email, 
      token 
    }, 
  })
}

const updateUser = async (req, res) => {
  const {userId} = req.user;
  const {email, name, location, lastName} = req.body;

  if(!email || !name || !location || !lastName){
    throw new BadRequestError('Please provide all values')
  }
  
  const user = await User.findOneAndUpdate({_id:userId}, {...req.body}, {new: true})
  const token = user.createJWT();

  if(!user) {
    throw new NotFoundError('User No found')
  }

  res.status(StatusCodes.OK).json({
    user:{
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    }   
  })
}

module.exports = {
  register,
  login,
  updateUser,
}

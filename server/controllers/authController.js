const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  UnauthenticatedError,
} = require('../errors/allErrors');

// register user
const register = async (req, res) => {
  // req.body will follow User Schema
  // see User Model (in models directory) for createJWT and getName functions
  const user = await User.create(req.body);
  const token = user.createJWT();
  // return jwt token and user's name
  return res
    .status(StatusCodes.CREATED)
    .json({ token, user: { name: user.getName(), email: user.getEmail() } });
};

// login user
// need email and password to login (no need for name in register)
const login = async (req, res) => {
  // if email, pw don't exist -> bad request error
  // if user doesn't exist -> unauthenticated error
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials.');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials.');
  }

  // return jwt token and username
  const token = user.createJWT();
  return res.status(StatusCodes.OK).json({  token, user: { name: user.name } });
};

// TODO: create logout method

module.exports = {
  register,
  login,
};

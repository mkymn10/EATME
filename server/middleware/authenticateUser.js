const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors/allErrors');

const authorize = async (req, res, next) => {
  // console.log('IN AUTHORIZE');
  // check the authorization header
  const authHeader = req.headers.authorization;
  // console.log('authheader:' , authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Invalid authentication.');
  }
  // split 'Bearer [jwt token here]' -> [Bearer, token]
  const token = authHeader.split(' ')[1];
  try {
    // verify jwt and return payload
    // if signature is not valid, throw error
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes (or req object)
    req.user = { userId: payload.userId, name: payload.name };
    return next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication.');
  }
};

module.exports = authorize;

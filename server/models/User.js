const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide name.'],
    maxlength: [50, 'Name cannot be more than 50 characters.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email.'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email.',
    ],
    unique: [
      true,
      'An account with this email already exists. Please provide a different email.',
    ],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password.'],
    minlength: [8, 'Password must be at least 8 characters long.'],
  },
});

UserSchema.pre('save', async function (next) {
  // generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.methods.getName = function () {
  return this.name;
};

UserSchema.methods.getEmail = function () {
  return this.email;
};

UserSchema.methods.createJWT = function () {
  // sign token
  // payload will include _id and name from User Model
  console.log(process.env.JWT_DURATION);
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_DURATION,
    }
  );
};

UserSchema.methods.comparePassword = async function (inputPassword) {
  const isSamePassword = await bcrypt.compare(inputPassword, this.password);
  return isSamePassword;
};

module.exports = mongoose.model('User', UserSchema);

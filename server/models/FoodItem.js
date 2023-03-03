const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name of food item.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    expirationDate: {
      type: Date,
      required: [true, 'Please provide an expiration date.'],
    },
    quantity: {
      type: Number,
      default: 1,
    },
    location: {
      type: String,
      required: [true, 'Please provide where you store this food item.'],
      trim: true,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user.'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodItem', foodItemSchema);

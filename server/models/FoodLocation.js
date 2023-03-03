const mongoose = require('mongoose');

const foodLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide location of food item.'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user.'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodLocation', foodLocationSchema);

const mongoose = require('mongoose');

const shoppingListItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        'Please provide name of ingredient to add to your shopping list.',
      ],
      trim: true,
    },
    description: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      default: 1,
    },
    boughtAt: {
      type: String,
      trim: true
    },
    bought: {
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

module.exports = mongoose.model('ShoppingListItem', shoppingListItemSchema);

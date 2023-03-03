const mongoose = require('mongoose');

const recipeItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the name of the recipe.'],
      trim: true,
    },
    link: {
      type: String,
      required: [true, 'Please provide the link to the recipe.'],
      trim: true,
    },
    favorite: {
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

module.exports = mongoose.model('RecipeItem', recipeItemSchema);

const express = require('express');
const router = express.Router();

const {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

router.route('/').post(createRecipe).get(getAllRecipes);
router.route('/:id').get(getRecipe).patch(updateRecipe).delete(deleteRecipe);

module.exports = router;

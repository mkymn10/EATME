const express = require('express');
const router = express.Router();

const {
  getAllFoodItems,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/foodItemsController');

router.route('/').post(createFoodItem).get(getAllFoodItems);
router
  .route('/:id')
  .get(getFoodItem)
  .patch(updateFoodItem)
  .delete(deleteFoodItem);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  getAllFoodLocations,
  getFoodLocation,
  createFoodLocation,
  updateFoodLocation,
  deleteFoodLocation,
} = require('../controllers/foodLocController');

router.route('/').post(createFoodLocation).get(getAllFoodLocations);
router
  .route('/:id')
  .get(getFoodLocation)
  .patch(updateFoodLocation)
  .delete(deleteFoodLocation);

module.exports = router;

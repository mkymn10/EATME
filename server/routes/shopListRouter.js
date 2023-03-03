const express = require('express');
const router = express.Router();

const {
  getAllShopListItems,
  getShopListItem,
  createShopListItem,
  updateShopListItem,
  deleteShopListItem,
} = require('../controllers/shopListController');

router.route('/').post(createShopListItem).get(getAllShopListItems);
router
  .route('/:id')
  .get(getShopListItem)
  .patch(updateShopListItem)
  .delete(deleteShopListItem);

module.exports = router;

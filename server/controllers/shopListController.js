const ShopListItem = require('../models/ShoppingListItem');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/allErrors');

const getAllShopListItems = async (req, res) => {
  // search by name/ description/ location/ boughtAt, bought(?) of food item?
  const { name, description, boughtAt, bought, sortBy, selectedFields } =
    req.query;
  const queryObj = {};
  if (name) queryObj.name = { $regex: name, $options: 'i' };
  if (description)
    queryObj.description = { $regex: description, $options: 'i' };
  if (boughtAt) queryObj.boughtAt = { $regex: boughtAt, $options: 'i' };
  if (bought) queryObj.bought = bought === 'true' ? true : false;

  // find user by id
  queryObj.createdBy = req.user.userId;
  // choose how many food items to display per page
  let result = ShopListItem.find(queryObj);

  // sort by expiration date, name
  if (sortBy) {
    // example: sortBy = '-name,expirationDate' -> '-name expirationDate'
    // sort by name desc first, then expirationDate
    const sortList = sortBy.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createAt');
  }

  // select only particular fields
  if (selectedFields) {
    // example: selectedFields = 'name,expirationDate' -> 'name expirationDate'
    const fieldsList = selectedFields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const shopListItem = await result;
  return res
    .status(StatusCodes.OK)
    .json({ shopListItem, numItems: shopListItem.length });
};

const getShopListItem = async (req, res) => {
  // extract userId from req.user
  // extract id from req.params, rename as shopListId
  const {
    user: { userId },
    params: { id: shopListId },
  } = req;
  const shopListItem = await ShopListItem.findOne({
    _id: shopListId,
    createdBy: userId,
  });
  if (!shopListItem) {
    throw new NotFoundError(`No Shop List Item found with id ${shopListId}.`);
  }
  return res.status(200).json({ shopListItem });
};

const createShopListItem = async (req, res) => {
  // assign createdBy property on req.body to reference user's id
  req.body.createdBy = req.user.userId;
  const newShopListItem = await ShopListItem.create(req.body);
  return res.status(StatusCodes.CREATED).json({ newShopListItem });
};

const updateShopListItem = async (req, res) => {
  // things to update: name, description, quantity, boughtAt, bought
  // extract fields to update from req.body
  // we don't extract bought because no error handling required
  // extract userId from req.user
  // extract id from req.params, rename as shopListId
  const {
    body: { name, description, quantity, boughtAt },
    user: { userId },
    params: { id: shopListId },
  } = req;

  if (name === '') throw new BadRequestError('Name field cannot be empty.');
  if (description === '')
    throw new BadRequestError('Description field cannot be empty.');
  if (quantity <= 0)
    throw new BadRequestError('Quantity must be larger than 0.');
  if (boughtAt === '')
    throw new BadRequestError('Buy at field cannot be empty.');

  const updatedShopListItem = await ShopListItem.findByIdAndUpdate(
    { _id: shopListId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedShopListItem) {
    throw new NotFoundError(
      `No Shop List Item to update with id ${shopListId}.`
    );
  }

  return res.status(StatusCodes.OK).json({ updatedShopListItem });
};

const deleteShopListItem = async (req, res) => {
  // extract userId from req.user
  // extract id from req.params, rename as shopListId
  const {
    user: { userId },
    params: { id: shopListId },
  } = req;
  const deletedShopListItem = await ShopListItem.findByIdAndDelete({
    _id: shopListId,
    createdBy: userId,
  });
  if (!deletedShopListItem) {
    throw new NotFoundError(
      `No Shop List Item to delete with id ${shopListId}.`
    );
  }
  return res.status(StatusCodes.OK).json({ deletedShopListItem });
};

module.exports = {
  getAllShopListItems,
  getShopListItem,
  createShopListItem,
  updateShopListItem,
  deleteShopListItem,
};

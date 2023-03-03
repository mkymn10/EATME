const FoodItem = require('../models/FoodItem');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/allErrors');

const getAllFoodItems = async (req, res) => {
  // search by name/ description/ location, expired(?) of food item?
  const { name, description, location, expired, sortBy, selectedFields } =
    req.query;
  const queryObj = {};
  if (name) queryObj.name = { $regex: name, $options: 'i' };
  if (description)
    queryObj.description = { $regex: description, $options: 'i' };
  if (location) queryObj.location = { $regex: location, $options: 'i' };
  if (expired) queryObj.expired = expired === 'true' ? true : false;

  // find user by id
  queryObj.createdBy = req.user.userId;
  // choose how many food items to display per page
  let result = FoodItem.find(queryObj);

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
  const foodItems = await result;

  return res
    .status(StatusCodes.OK)
    .json({ foodItems, numItems: foodItems.length });
};

const getFoodItem = async (req, res) => {
  // extract userId from req.user
  // extract id from req.params, rename as foodItemId
  const {
    user: { userId },
    params: { id: foodItemId },
  } = req;
  const foodItem = await FoodItem.findOne({
    _id: foodItemId,
    createdBy: userId,
  });
  if (!foodItem) {
    throw new NotFoundError(`No Food Item found with id ${foodItemId}.`);
  }
  return res.status(200).json({ foodItem });
};

const createFoodItem = async (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0)
    throw new BadRequestError('Quantity must be larger than 0.');
  // assign createdBy property on req.body to reference user's id
  req.body.createdBy = req.user.userId;
  const newFoodItem = await FoodItem.create(req.body);
  return res.status(StatusCodes.CREATED).json({ newFoodItem });
};

const updateFoodItem = async (req, res) => {
  // things to update: name, description, expirationDate, quantity, location, expired
  // we don't extract expired because no error handling required
  // extract fields to update from req.body
  // extract userId from req.user
  // extract id from req.params, rename as foodItemId
  const {
    body: { name, description, expirationDate, quantity, location },
    user: { userId },
    params: { id: foodItemId },
  } = req;

  if (name === '') throw new BadRequestError('Name field cannot be empty.');
  if (description === '')
    throw new BadRequestError('Description field cannot be empty.');
  if (expirationDate === '')
    throw new BadRequestError('Expiration date field cannot be empty.');
  if (quantity <= 0)
    throw new BadRequestError('Quantity must be larger than 0.');
  if (location === '')
    throw new BadRequestError('Location field cannot be empty.');

  const updatedFoodItem = await FoodItem.findByIdAndUpdate(
    { _id: foodItemId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedFoodItem) {
    throw new NotFoundError(`No Food Item to update with id ${foodItemId}.`);
  }

  return res.status(StatusCodes.OK).json({ updatedFoodItem });
};

const deleteFoodItem = async (req, res) => {
  // extract userId from req.user
  // extract id from req.params, rename as foodItemId
  const {
    user: { userId },
    params: { id: foodItemId },
  } = req;
  const deletedFoodItem = await FoodItem.findByIdAndDelete({
    _id: foodItemId,
    createdBy: userId,
  });
  if (!deletedFoodItem) {
    throw new NotFoundError(`No Food Item to delete with id ${foodItemId}.`);
  }
  return res.status(StatusCodes.OK).json({ deletedFoodItem });
};

module.exports = {
  getAllFoodItems,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
};

const FoodLocation = require('../models/FoodLocation');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/allErrors');

const getAllFoodLocations = async (req, res) => {
  // search by name of location?
  const { name, sortBy } = req.query;
  const queryObj = {};
  // find by user's food locations
  if (name) queryObj.name = { $regex: name, $options: 'i' };
  // find user by id
  queryObj.createdBy = req.user.userId;

  let result = FoodLocation.find(queryObj);

  // sort by name
  if (sortBy) {
    // example: sortBy = '-name' -> '-name'
    // sort by name desc first, then expirationDate
    // const sortList = sortBy.split(',').join(' ');
    result = result.sort(sortBy);
  } else {
    result = result.sort('createAt');
  }

  // choose how many locations to display per page
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const foodLocations = await result;
  return res
    .status(StatusCodes.OK)
    .json({ foodLocations, numLoc: foodLocations.length });
};

const getFoodLocation = async (req, res) => {
  // extract userId from req.user
  // extract id from req.params, rename as locationId
  const {
    user: { userId },
    params: { id: locationId },
  } = req;
  const foodLocation = await FoodLocation.findOne({
    _id: locationId,
    createdBy: userId,
  });

  if (!foodLocation) {
    throw new NotFoundError(`No Food Location found with id ${locationId}.`);
  }

  return res.status(200).json({ foodLocation });
};

const createFoodLocation = async (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0)
    throw new BadRequestError('Quantity must be larger than 0.');
  // assign createdBy property on req.body to reference user's id
  req.body.createdBy = req.user.userId;
  const newFoodLocation = await FoodLocation.create(req.body);
  return res.status(StatusCodes.CREATED).json({ newFoodLocation });
};

const updateFoodLocation = async (req, res) => {
  // only thing to update is the name
  // extract name from req.body
  // extract userId from req.user
  // extract id from req.params, rename as locationId
  const {
    body: { name },
    user: { userId },
    params: { id: locationId },
  } = req;
  // if the name field is empty
  if (name === '') {
    throw new BadRequestError('Name field cannot be empty.');
  }

  const updatedFoodLocation = await FoodLocation.findByIdAndUpdate(
    { _id: locationId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedFoodLocation) {
    throw new NotFoundError(
      `No Food Location to update with id ${locationId}.`
    );
  }

  return res.status(StatusCodes.OK).json({ updatedFoodLocation });
};

const deleteFoodLocation = async (req, res) => {
  // extract userId from req.user
  // extract id from req.params, rename as locationId
  const {
    user: { userId },
    params: { id: locationId },
  } = req;
  const deletedFoodLocation = await FoodLocation.findByIdAndDelete({
    _id: locationId,
    createdBy: userId,
  });
  if (!deletedFoodLocation) {
    throw new NotFoundError(
      `No Food Location to delete with id ${locationId}.`
    );
  }
  return res.status(StatusCodes.OK).json({ deletedFoodLocation });
};

module.exports = {
  getAllFoodLocations,
  getFoodLocation,
  createFoodLocation,
  updateFoodLocation,
  deleteFoodLocation,
};

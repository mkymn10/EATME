const Recipe = require('../models/RecipeItem');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/allErrors');

const getAllRecipes = async (req, res) => {
  // search by name, link, favorite?
  const { name, link, favorite, sortBy } = req.query;
  const queryObj = {};
  if (name) queryObj.name = { $regex: name, $options: 'i' };
  if (link) queryObj.link = { $regex: link, $options: 'i' };
  if (favorite) queryObj.favorite = favorite === 'true' ? true : false;
  // find user by id
  queryObj.createdBy = req.user.userId;

  let result = Recipe.find(queryObj);

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
  const recipes = await result;
  return res.status(StatusCodes.OK).json({ recipes, numLoc: recipes.length });
};

const getRecipe = async (req, res) => {
  // extract userId from req.user
  // extract id from req.params, rename as recipeId
  const {
    user: { userId },
    params: { id: recipeId },
  } = req;
  const recipe = await Recipe.findOne({
    _id: recipeId,
    createdBy: userId,
  });
  if (!recipe) {
    throw new NotFoundError(`No Food Item found with id ${recipeId}.`);
  }
  return res.status(200).json({ recipe });
};

const createRecipe = async (req, res) => {
  // assign createdBy property on req.body to reference user's id
  req.body.createdBy = req.user.userId;
  const newRecipe = await Recipe.create(req.body);
  return res.status(StatusCodes.CREATED).json({ newRecipe });
};

const updateRecipe = async (req, res) => {
  // things to update: name, link, favorite
  // we don't extract favorite because no error handling required
  // extract fields to update from req.body
  // extract userId from req.user
  // extract id from req.params, rename as recipeId
  const {
    body: { name, link },
    user: { userId },
    params: { id: recipeId },
  } = req;

  if (name === '') throw new BadRequestError('Name field cannot be empty.');
  if (link === '') throw new BadRequestError('Link field cannot be empty.');

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    { _id: recipeId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedRecipe) {
    throw new NotFoundError(`No Food Item to update with id ${recipeId}.`);
  }

  return res.status(StatusCodes.OK).json({ updatedRecipe });
};

const deleteRecipe = async (req, res) => {
  // extract userId from req.user
  // extract id from req.params, rename as recipeId
  const {
    user: { userId },
    params: { id: recipeId },
  } = req;
  const deletedRecipe = await Recipe.findByIdAndDelete({
    _id: recipeId,
    createdBy: userId,
  });
  if (!deletedRecipe) {
    throw new NotFoundError(`No Food Item to delete with id ${recipeId}.`);
  }
  return res.status(StatusCodes.OK).json({ deletedRecipe });
};

module.exports = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};

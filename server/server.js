// set up .env and async/await errors in express
require('dotenv').config();
require('express-async-errors');

// extra security packages
// helmet: middleware that helps secure express apps by setting http headers
const helmet = require('helmet');
// cors (cross origin resource sharing): middleware that can be used to enable cors
const cors = require('cors');
// xss: helps prevent cross site scripting attacks/ malicious code injections
const xss = require('xss-clean');

// enable express:
const express = require('express');
const app = express();

// connect DB (see function in db folder):
const connectDB = require('./db/connect');

// authentication middleware
const authenticateUser = require('./middleware/authenticateUser');

// error handler middleware
const notFoundError = require('./middleware/notFoundError');
const globalErrorHandler = require('./middleware/globalErrorHandler');

// routers
const authRouter = require('./routes/authRouter');
const foodItemsRouter = require('./routes/foodItemsRouter');
const foodLocRouter = require('./routes/foodLocRouter');
const shopListRouter = require('./routes/shopListRouter');
const recipeRouter = require('./routes/recipeRouter');

// all general purpose middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use('/api/authuser', authRouter);
app.use('/api/fooditems', authenticateUser, foodItemsRouter);
// app.use('/api/fooditems', foodItemsRouter);
app.use('/api/foodlocations', authenticateUser, foodLocRouter);
app.use('/api/shoppinglist', authenticateUser, shopListRouter);
app.use('/api/recipes', authenticateUser, recipeRouter);

// use error handler middleware
// 404
app.use(notFoundError);
// global
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log('Error in starting app:', error);
  }
};

start();

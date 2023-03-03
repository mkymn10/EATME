const { StatusCodes } = require('http-status-codes');
const globalErrorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default status code
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'In global error handler, something went wrong',
  };

  // error during register: if name or email or password isn't filled out
  if (err.name === 'ValidationError') {
    console.log(Object.values(err.errors));
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }

  // duplicate email error
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field. Please choose another value.`;
    customError.statusCode = 400;
  }

  // error if you try to get/ find something that doesn't exist
  if (err.name === 'CastError') {
    customError.message = `No item found with id: ${err.value}.`;
    customError.statusCode = 404;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ message: customError.message });
};

module.exports = globalErrorHandlerMiddleware;

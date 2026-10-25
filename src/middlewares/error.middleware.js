export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",

    ...(err.errors && { errors: err.errors }),
  });

  // let message = err.message || "Internal server error";

  // if (err.code === 11000) {
  //   statusCode = 409;
  //   message = "A record with this value already exists";
  // }

  // if (err.name === "ValidationError" || err.name === "CastError") {
  //   statusCode = 400;
  //   message = err.message;
  // }

  // res.status(statusCode).json({
  //   success: false,
  //   message
  // });
};
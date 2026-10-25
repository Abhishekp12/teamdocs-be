
import { validationResult } from "express-validator";
import createError from "http-errors";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      createError(400, "Validation failed", {
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      })
    );
  }

  next();
};


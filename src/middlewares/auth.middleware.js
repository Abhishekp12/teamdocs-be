
import jwt from "jsonwebtoken";
import createError from "http-errors";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check whether the Authorization header exists.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Authentication token required");
    }

    // 2. Extract the token after "Bearer ".
    const token = authHeader.split(" ")[1];

    // 3. Verify the token's signature and expiry.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the authenticated user's identity to the request.
    req.user = {
      _id: decoded.sub,
      role: decoded.role
    };

    // 5. Continue to the next middleware or controller.
    next();
  } catch (error) {
    if (error.status === 401) {
      return next(error);
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return next(createError(401, "Invalid or expired token"));
    }

    return next(error);
  }
};


import bcrypt from "bcryptjs";
import createError from "http-errors";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const registerUserService = async ({ name, email, password }) => {
  // 1. Check whether the email is already registered.
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    throw createError(409, "Email is already registered");
  }

  // 2. Hash the password before saving it.
  const passwordHash = await bcrypt.hash(password, 12);

  // 3. Create the user.
  // Never accept the public user's role from the request body.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "employee"
  });

  // 4. Return safe user data, excluding the password hash.
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
};


export const logInUSerService=async({email,password})=>{
  // 1. Find the user and explicitly include passwordHash.
  const user = await User.findOne({
    email: email.trim().toLowerCase()
  }).select("+passwordHash");

  // Use the same error for unknown email and wrong password.
  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  // 2. Compare the submitted password with the saved hash.
  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw createError(401, "Invalid email or password");
  }

  // 3. Ensure the JWT secret is configured.
  if (!process.env.JWT_SECRET) {
    throw createError(500, "Authentication is not configured");
  }

  // 4. Create a signed token.
  const token = jwt.sign(
    {
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    }
  );

  // 5. Return the token and safe user information.
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
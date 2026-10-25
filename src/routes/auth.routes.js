import { Router } from "express";
import { loginUserController, registerUserController } from "../controllers/auth.controller.js";
import {
  loginLimiter,
  registerLimiter,
} from "../middlewares/rate-limit.middleware.js";

const router=Router();

router.post("/register",registerLimiter, registerUserController);
router.post("/login",loginLimiter, loginUserController)

export default router
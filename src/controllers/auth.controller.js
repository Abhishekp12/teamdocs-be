import { logInUSerService, registerUserService } from "../services/user.service.js";



export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};


export const loginUserController=async(req,res,next)=>{
   try {
    const result = await logInUSerService(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
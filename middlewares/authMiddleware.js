import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
// protected route middleware using JWT(json web Token)
export const requireSignIn = async (req, res, next) => {
  try {
    // verify JWT token with the help of authorization key of header object in the basic of JWT_SECRET key
    const decode = await JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = await decode;
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      error,
      message: "Error in require SignIn middleWare",
    });
  }
};

// Admin Access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      error,
      message: "Error in Admin MiddleWare",
    });
  }
};

import { comparePassword, hashedPassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

// registration Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, answer, address } = req.body;
    // checking required fields not empty
    if (!name) {
      return res.status(201).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(201).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(201).send({
        success: false,
        message: "Password is required",
      });
    }
    if (!phone) {
      return res.status(201).send({
        success: false,
        message: "Phone is required",
      });
    }
    if (!address) {
      return res.status(201).send({
        success: false,
        message: "Address is required",
      });
    }
    if (!answer) {
      return res.status(201).send({
        success: false,
        message: "Answer is required",
      });
    }
    // check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: "Already registered Please Login",
      });
    }
    // register User
    const hashPassword = await hashedPassword(password);
    // save new user in Database
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashPassword,
    }).save();
    res.status(200).send({
      success: true,
      message: "User register successfully",
      user,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "error in registration",
      error,
    });
  }
};

// LogIn Controller
export const loginController = async (req, res) => {
  try {
    // checking the condition when email and password is empty while passing from the client
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(201).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    // checking user email is present in database or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(202).send({
        success: false,
        message: "Email is not registered",
      });
    }
    // Compare user Entered password and bcrypt password with the help of comparePassword and matching the password is present in database or not
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(203).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // Creating JWT Token on the basis of _id with JWT_SECRET which is .env file and it is expire in 7 day.
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

// test controllers for middleware checking
export const testController = (req, res) => {
  res.send("protected route");
};

// Forget Password

export const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res.status(201).send({ message: "Email is required" });
    }
    if (!answer) {
      return res.status(201).send({ message: "answer is require" });
    }
    if (!newPassword) {
      return res.status(201).send({ message: "New Password is required" });
    }

    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(202).send({
        success: false,
        message: "Invalid Email or password",
      });
    }

    const hashPass = await hashedPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashPass });
    return res.status(200).send({
      success: true,
      message: "Reset Password Successfully",
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "something went wrong!",
      error,
    });
  }
};

// Update Profile

export const updateProfile = async (req, res) => {
  try {
    const { name, password, phone, address, email } = req.body;
    const user = await userModel.findById(req.user._id);
    // password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long." });
    }

    const hashedUpdatePassword = password
      ? await hashedPassword(password)
      : undefined;
    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        phone: phone || user.phone,
        password: hashedUpdatePassword || user.password,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Update Profile Successfully.",
      updateUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

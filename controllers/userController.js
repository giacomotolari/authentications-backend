import sgMail from "@sendgrid/mail";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { JWT_SECRETKEY } from "../global.js";
import User from "../models/User.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const error = {
  server: createError(500, "Server Error"),
  userNotFound: createError(404, "User not found"),
};

export const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    age,
    password,
    country,
    city,
    street,
    postalCode,
    role,
  } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = createError(409, "user already exists!");
      return next(error);
    }
    const user = new User({
      firstName,
      lastName,
      email,
      age,
      password,
      address: {
        country,
        city,
        street,
        postalCode,
      },
      role,
    });
    await user.save();
    const userWithoutPassword = user.deleteField(user.password);

    const msg = {
      to: user.email,
      from: "giacomo.tolari@taliox.io",
      subject: "Sending with Twilio SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };

    (async () => {
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    })();
    return res
      .status(201)
      .json({ msg: "User created Successfully!", userWithoutPassword });
  } catch (error) {
    next(serverError);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = createError(404, "email not found!");
      return next(error);
    }
    const matched = await user.comparePassword(password, user.password);
    if (!matched) {
      const error = createError(500, "password incorrect!");
      return next(error);
    }
    const payload = { userId: user.id };
    const token = jwt.sign(payload, JWT_SECRETKEY, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // one day
    });
    res.json({ msg: "you are logged in!!" });
  } catch (err) {
    console.log("🚀 ~ file: userController.js:95 ~ login ~ error:", err);
    next(serverError);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json({ allUsers });
  } catch (error) {
    console.log(
      "🚀 ~ file: userController.js:105 ~ getAllUsers ~ error:",
      error
    );
    next(serverError);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return next(userNotFound);
    }
    res.json({ user });
  } catch (error) {
    console.log("🚀 ~ file: userController.js:119 ~ getUser ~ error:", error);
    next(serverError);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      next(userNotFound);
    }
    await User.deleteOne({ _id: id });
    res.status(200).json({ user });
  } catch (error) {
    console.log(
      "🚀 ~ file: userController.js:134 ~ deleteUser ~ error:",
      error
    );
    next(serverError);
  }
};

export const deleteAll = async (req, res, next) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ msg: "All users deleted" });
  } catch (error) {
    console.log("🚀 ~ file: userController.js:144 ~ deleteAll ~ error:", error);
    next(serverError);
  }
};

import jwt from "jsonwebtoken";
import { JWT_SECRETKEY } from "../global.js";
import createError from "http-errors";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      const error = createError(500, { msg: "no token" });
      return next(error);
    }
    const decode = await jwt.verify(token, JWT_SECRETKEY);
    console.log("🚀 ~ file: authenticate.js:13 ~ authenticate ~ decode:", decode)
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    const error = createError(500, { msg: "server error" });
    next(error);
  }
};

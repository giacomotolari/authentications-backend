import createError from "http-errors";
import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== "admin") {
      const error = createError(404, { msg: "You are not an Admin 😠 " });
      return next(error);
    }
    next();
  } catch (error) {
    console.log("🚀 ~ file: roleAuth.js:13 ~ isAdmin ~ error:", error);
    next(createError(500, { msg: "Server Error!" }));
    res.json({ error: error });
  }
};


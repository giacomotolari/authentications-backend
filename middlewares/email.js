import { SENDGRID_API_KEY } from "../global.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(SENDGRID_API_KEY);



export const authenticate = async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        const error = createError(500, { msg: "no token" });
        next(error);
      }
      const decode = await jwt.verify(token, JWT_SECRETKEY);
      req.user = decode;
      next();
    } catch (err) {
      console.log(err);
      const error = createError(500, { msg: "server error" });
      next(error);
    }
  };
  
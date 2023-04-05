import { body, validationResult, param } from "express-validator";
import createError from "http-errors";
import { UserSchema } from "../models/User.js";

const requiredFields = UserSchema.requiredPaths();

const requiredFieldsValidation = requiredFields.map((field) => {
  return body(field).exists().withMessage(`${field} is required`);
});

export const registerValidationRules = [
  ...requiredFieldsValidation,
  body("firstName")
    .isLength({ min: 3 })
    .withMessage(`firstName must be at least 3 characters long`),
  body("lastName")
    .isLength({ min: 3 })
    .withMessage(`LastName must be at least 3 characters long`),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("you have to enter a valid Email !!!"),
  body("country")
    .not()
    .isEmpty()
    .withMessage("you have to insert a country !!!"),
  body("password").isString().withMessage("password must be a stirng"),
  body("age").isInt().withMessage("age must be a number"),
];

export const mongoParamIDValidations = [
  param("id").isMongoId().withMessage("invalid ID"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createError(400, { errors: errors.array() });
    next(error);
  }
  return next();
};

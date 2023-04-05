import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/roleAuth.js";
import {
  registerValidationRules,
  mongoParamIDValidations,
  validate,
} from "../middlewares/userValidation.js";

import {
  deleteAll,
  deleteUser,
  getAllUsers,
  getUser,
  login,
  register,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerValidationRules, validate, register);
router.post("/login", login);
router.get("/all", authenticate, validate, isAdmin, getAllUsers);
router.get("/one/:id", mongoParamIDValidations, validate, getUser);
router.delete("/delete-one/:id", mongoParamIDValidations, validate, deleteUser);
router.delete("/delete-all/", deleteAll);

export default router;

const express = require("express");
const Joi = require("joi");
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");

const router = express.Router();

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid("admin", "user").optional()
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken);
router.post("/logout", validate(refreshTokenSchema), authController.logout);

module.exports = router;

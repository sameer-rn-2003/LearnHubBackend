const express = require("express");
const Joi = require("joi");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const router = express.Router();

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(160).required(),
  description: Joi.string().allow("", null).optional(),
  price: Joi.number().min(0).required(),
  categoryIds: Joi.array().items(Joi.string().guid({ version: "uuidv4" })).default([])
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(160).optional(),
  description: Joi.string().allow("", null).optional(),
  price: Joi.number().min(0).optional(),
  categoryIds: Joi.array().items(Joi.string().guid({ version: "uuidv4" })).optional()
}).or("name", "description", "price", "categoryIds");

router.use(authMiddleware);

router.post("/", validate(createProductSchema), productController.createProduct);
router.put("/:id", validate(updateProductSchema), productController.updateProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct);

module.exports = router;

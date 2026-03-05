const express = require("express");
const Joi = require("joi");
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const router = express.Router();

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required()
});

router.use(authMiddleware);

router.post("/", validate(createCategorySchema), categoryController.createCategory);
router.put("/:id", validate(updateCategorySchema), categoryController.updateCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

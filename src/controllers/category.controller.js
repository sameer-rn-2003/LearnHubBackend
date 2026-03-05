const categoryService = require("../services/category.service");

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json({
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    return next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return res.status(200).json({
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    return next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories
    });
  } catch (error) {
    return next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return res.status(200).json({
      message: "Category fetched successfully",
      data: category
    });
  } catch (error) {
    return next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return res.status(200).json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory
};

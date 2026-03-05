const productService = require("../services/product.service");

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return res.status(200).json({
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({
      message: "Products fetched successfully",
      data: products
    });
  } catch (error) {
    return next(error);
  }
};

const getAllProductsWithCategories = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({
      message: "Products with categories fetched successfully",
      data: products
    });
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return res.status(200).json({
      message: "Product fetched successfully",
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    return res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getAllProductsWithCategories,
  getProductById,
  deleteProduct
};

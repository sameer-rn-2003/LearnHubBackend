const { Category, Product, ProductCategory } = require("../models");

const formatDocument = (doc) => {
  if (!doc) return null;
  const raw = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const { _id, ...rest } = raw;
  return { id: _id, ...rest };
};

const attachProductsToCategories = async (categories) => {
  const formattedCategories = categories.map(formatDocument);
  const categoryIds = formattedCategories.map((category) => category.id);
  if (!categoryIds.length) {
    return [];
  }

  const links = await ProductCategory.find({ categoryId: { $in: categoryIds } }).lean();
  const productIds = [...new Set(links.map((link) => link.productId))];
  const products = productIds.length ? await Product.find({ _id: { $in: productIds } }).lean() : [];

  const productMap = new Map(
    products.map((product) => {
      const formattedProduct = formatDocument(product);
      return [formattedProduct.id, formattedProduct];
    })
  );
  const categoryProductsMap = new Map();

  links.forEach((link) => {
    if (!categoryProductsMap.has(link.categoryId)) {
      categoryProductsMap.set(link.categoryId, []);
    }
    categoryProductsMap.get(link.categoryId).push(link.productId);
  });

  return formattedCategories.map((category) => {
    const linkedProductIds = categoryProductsMap.get(category.id) || [];
    const linkedProducts = linkedProductIds.map((productId) => productMap.get(productId)).filter(Boolean);

    return {
      ...category,
      products: linkedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price
      }))
    };
  });
};

const createCategory = async ({ name }) => {
  const existing = await Category.findOne({ name });
  if (existing) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  const category = await Category.create({ name });
  return formatDocument(category);
};

const updateCategory = async (id, { name }) => {
  const category = await Category.findById(id);
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  category.name = name;
  await category.save();
  return formatDocument(category);
};

const getAllCategories = async () => {
  const categories = await Category.find().lean();
  return attachProductsToCategories(categories);
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id).lean();
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const [enrichedCategory] = await attachProductsToCategories([category]);
  return enrichedCategory;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  await ProductCategory.deleteMany({ categoryId: id });
  await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory
};

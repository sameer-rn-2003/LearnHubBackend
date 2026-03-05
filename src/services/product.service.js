const { Product, Category, ProductCategory } = require("../models");

const formatDocument = (doc) => {
  if (!doc) return null;
  const raw = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const { _id, ...rest } = raw;
  return { id: _id, ...rest };
};

const getCategoriesByIds = async (categoryIds = []) => {
  const uniqueCategoryIds = [...new Set(categoryIds)];
  if (!uniqueCategoryIds.length) {
    return [];
  }

  const categories = await Category.find({ _id: { $in: uniqueCategoryIds } }).lean();

  if (categories.length !== uniqueCategoryIds.length) {
    const error = new Error("One or more category IDs are invalid");
    error.statusCode = 400;
    throw error;
  }

  return categories;
};

const setProductCategories = async (productId, categoryIds = []) => {
  await ProductCategory.deleteMany({ productId });

  if (!categoryIds.length) {
    return;
  }

  await ProductCategory.insertMany(
    categoryIds.map((categoryId) => ({ productId, categoryId })),
    { ordered: false }
  );
};

const attachCategoriesToProducts = async (products) => {
  const formattedProducts = products.map(formatDocument);
  const productIds = formattedProducts.map((product) => product.id);
  if (!productIds.length) {
    return [];
  }

  const links = await ProductCategory.find({ productId: { $in: productIds } }).lean();
  const categoryIds = [...new Set(links.map((link) => link.categoryId))];
  const categories = categoryIds.length
    ? await Category.find({ _id: { $in: categoryIds } }).lean()
    : [];

  const categoryMap = new Map(categories.map((category) => [category._id, formatDocument(category)]));
  const productCategoryMap = new Map();

  links.forEach((link) => {
    if (!productCategoryMap.has(link.productId)) {
      productCategoryMap.set(link.productId, []);
    }
    productCategoryMap.get(link.productId).push(link.categoryId);
  });

  return formattedProducts.map((product) => {
    const linkedCategoryIds = productCategoryMap.get(product.id) || [];
    const linkedCategories = linkedCategoryIds
      .map((categoryId) => categoryMap.get(categoryId))
      .filter(Boolean);

    return {
      ...product,
      categories: linkedCategories
    };
  });
};

const createProduct = async ({ name, description, price, categoryIds = [] }) => {
  const categories = await getCategoriesByIds(categoryIds);
  const product = await Product.create({ name, description, price: Number(price) });

  await setProductCategories(
    product._id,
    categories.map((category) => category._id)
  );

  const [enrichedProduct] = await attachCategoriesToProducts([product]);
  return enrichedProduct;
};

const updateProduct = async (id, { name, description, price, categoryIds }) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const payload = {};
  if (typeof name !== "undefined") payload.name = name;
  if (typeof description !== "undefined") payload.description = description;
  if (typeof price !== "undefined") payload.price = Number(price);

  if (Object.keys(payload).length) {
    Object.assign(product, payload);
    await product.save();
  }

  if (Array.isArray(categoryIds)) {
    const categories = await getCategoriesByIds(categoryIds);
    await setProductCategories(
      product._id,
      categories.map((category) => category._id)
    );
  }

  const [enrichedProduct] = await attachCategoriesToProducts([product]);
  return enrichedProduct;
};

const getAllProducts = async () => {
  const products = await Product.find().lean();
  return attachCategoriesToProducts(products);
};

const getProductById = async (id) => {
  const product = await Product.findById(id).lean();
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const [enrichedProduct] = await attachCategoriesToProducts([product]);
  return enrichedProduct;
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await ProductCategory.deleteMany({ productId: id });
  await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProduct
};

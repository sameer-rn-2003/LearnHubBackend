const { mongoose } = require("../config/db");
const User = require("./user.model");
const Product = require("./product.model");
const Category = require("./category.model");
const ProductCategory = require("./productCategory.model");

module.exports = {
  mongoose,
  User,
  Product,
  Category,
  ProductCategory
};

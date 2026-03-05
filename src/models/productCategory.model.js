const { mongoose } = require("../config/db");

const productCategorySchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      ref: "Product"
    },
    categoryId: {
      type: String,
      required: true,
      ref: "Category"
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

productCategorySchema.index({ productId: 1, categoryId: 1 }, { unique: true });

module.exports =
  mongoose.models.ProductCategory || mongoose.model("ProductCategory", productCategorySchema);

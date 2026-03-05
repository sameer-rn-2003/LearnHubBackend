const dotenv = require("dotenv");
const { connectDB, mongoose } = require("../src/config/db");
const { Category, Product, ProductCategory } = require("../src/models");

dotenv.config();

const sampleCategories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Books",
  "Toys",
  "Grocery",
  "Automotive",
  "Health"
];

const sampleProducts = [
  {
    name: "Wireless Earbuds Pro",
    description: "Noise-cancelling earbuds with 24-hour battery life.",
    price: 89.99,
    categories: ["Electronics"]
  },
  {
    name: "Running Shoes X1",
    description: "Lightweight running shoes for daily training.",
    price: 74.5,
    categories: ["Fashion", "Sports"]
  },
  {
    name: "Stainless Steel Cookware Set",
    description: "10-piece cookware set for everyday cooking.",
    price: 129.0,
    categories: ["Home & Kitchen"]
  },
  {
    name: "Vitamin C Face Serum",
    description: "Hydrating serum with brightening effect.",
    price: 19.99,
    categories: ["Beauty", "Health"]
  },
  {
    name: "Adjustable Dumbbell Pair",
    description: "Space-saving dumbbell pair with quick-adjust weights.",
    price: 159.99,
    categories: ["Sports", "Health"]
  },
  {
    name: "Mystery Thriller Collection",
    description: "Set of three best-selling thriller novels.",
    price: 34.99,
    categories: ["Books"]
  },
  {
    name: "STEM Robotics Kit",
    description: "Beginner-friendly robotics kit for kids 10+.",
    price: 59.99,
    categories: ["Toys", "Electronics"]
  },
  {
    name: "Organic Breakfast Combo",
    description: "Healthy granola, oats, and dried fruit bundle.",
    price: 24.75,
    categories: ["Grocery", "Health"]
  },
  {
    name: "Car Care Cleaning Pack",
    description: "Shampoo, microfiber cloths, and tire polish kit.",
    price: 27.49,
    categories: ["Automotive"]
  },
  {
    name: "Smart Air Fryer 5L",
    description: "Touchscreen air fryer with preset cooking modes.",
    price: 109.95,
    categories: ["Home & Kitchen", "Electronics"]
  }
];

const upsertCategories = async () => {
  const categoryMap = new Map();
  let created = 0;
  let updated = 0;

  for (const name of sampleCategories) {
    const existing = await Category.findOne({ name });

    if (existing) {
      updated += 1;
      categoryMap.set(name, existing);
      continue;
    }

    const createdCategory = await Category.create({ name });
    created += 1;
    categoryMap.set(name, createdCategory);
  }

  return { categoryMap, created, updated };
};

const upsertProducts = async (categoryMap) => {
  let created = 0;
  let updated = 0;
  let linked = 0;

  for (const item of sampleProducts) {
    let product = await Product.findOne({ name: item.name });

    if (!product) {
      product = await Product.create({
        name: item.name,
        description: item.description,
        price: Number(item.price)
      });
      created += 1;
    } else {
      product.description = item.description;
      product.price = Number(item.price);
      await product.save();
      updated += 1;
    }

    const categoryIds = item.categories
      .map((name) => categoryMap.get(name))
      .filter(Boolean)
      .map((category) => category._id);

    await ProductCategory.deleteMany({ productId: product._id });

    if (categoryIds.length) {
      await ProductCategory.insertMany(
        categoryIds.map((categoryId) => ({
          productId: product._id,
          categoryId
        }))
      );
      linked += categoryIds.length;
    }
  }

  return { created, updated, linked };
};

const seed = async () => {
  const mongoDbName = process.env.MONGO_DB_NAME || "(default DB)";

  console.log(`Connecting to MongoDB database: ${mongoDbName}`);
  await connectDB();

  const { categoryMap, created: createdCategories, updated: updatedCategories } =
    await upsertCategories();
  const {
    created: createdProducts,
    updated: updatedProducts,
    linked: linkedProductCategories
  } = await upsertProducts(categoryMap);

  console.log("Sample data seed completed.");
  console.log(`Categories -> created: ${createdCategories}, existing: ${updatedCategories}`);
  console.log(`Products   -> created: ${createdProducts}, updated: ${updatedProducts}`);
  console.log(`Links      -> total rebuilt: ${linkedProductCategories}`);
};

seed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });

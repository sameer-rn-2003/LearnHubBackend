const dotenv = require("dotenv");
const app = require("./app");
const { connectDB } = require("./config/db");

dotenv.config();

const port = Number(process.env.PORT || 5000);

const assertRequiredEnv = () => {
  const required = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

const startServer = async () => {
  try {
    assertRequiredEnv();

    await connectDB();
    await initCollections();
    console.log("MongoDB connection established.");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

const { User, Product, Category, ProductCategory } = require("./models");

const initCollections = async () => {
  await Promise.all([
    User.createCollection(),
    Product.createCollection(),
    Category.createCollection(),
    ProductCategory.createCollection()
  ]);

  // Ensures unique/index definitions from schemas are applied
  await Promise.all([
    User.syncIndexes(),
    Product.syncIndexes(),
    Category.syncIndexes(),
    ProductCategory.syncIndexes()
  ]);
};

startServer();

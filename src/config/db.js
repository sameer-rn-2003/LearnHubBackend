const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  // const mongoUri = process.env.MONGO_URI;
  // const mongoDbName = process.env.MONGO_DB_NAME;

  const mongoUri = "mongodb+srv://sameer08github_db_user:7CZzj2CuY37lWdLt@cluster0.ovdxkpm.mongodb.net/";
  const mongoDbName = "node_template";

  await mongoose.connect(mongoUri, {
    dbName: mongoDbName
  });
};

module.exports = {
  mongoose,
  connectDB
};

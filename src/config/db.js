const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const mongoDbName = process.env.MONGO_DB_NAME;

  await mongoose.connect(mongoUri, {
    dbName: mongoDbName
  });
};

module.exports = {
  mongoose,
  connectDB
};

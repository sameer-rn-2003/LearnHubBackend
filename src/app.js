const express = require("express");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(morgan("combined"));
app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({ message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.get("/test", (req, res)=>{
res.send({
  msg : " server started"
})
})

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
